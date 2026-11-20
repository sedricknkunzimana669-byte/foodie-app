import 'package:flutter/material.dart';

void main() {
  runApp(const FoodieApp());
}

class FoodieApp extends StatelessWidget {
  const FoodieApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Foodie Delights',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFE85D32),
          surface: const Color(0xFFFFFBF7),
        ),
        scaffoldBackgroundColor: const Color(0xFFFFFBF7),
        fontFamily: 'Roboto',
      ),
      home: const FoodieHomePage(),
    );
  }
}

class FoodieHomePage extends StatefulWidget {
  const FoodieHomePage({super.key});

  @override
  State<FoodieHomePage> createState() => _FoodieHomePageState();
}

class _FoodieHomePageState extends State<FoodieHomePage> {
  static const _categories = [
    _FoodCategory(name: 'All', icon: Icons.restaurant_menu),
    _FoodCategory(name: 'African', icon: Icons.ramen_dining),
    _FoodCategory(name: 'Burgers', icon: Icons.lunch_dining),
    _FoodCategory(name: 'Pizza', icon: Icons.local_pizza),
    _FoodCategory(name: 'Desserts', icon: Icons.icecream),
  ];

  static const _initialRestaurants = [
    _Restaurant(
      name: 'The Hut',
      dish: 'Brochettes & fries',
      category: 'African',
      rating: '4.8',
      deliveryTime: '20–30 min',
      price: 'RWF 8,500',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=640&auto=format&fit=crop&q=80',
    ),
    _Restaurant(
      name: 'Burger House',
      dish: 'Classic beef burger',
      category: 'Burgers',
      rating: '4.7',
      deliveryTime: '15–25 min',
      price: 'RWF 6,000',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=640&auto=format&fit=crop&q=80',
    ),
    _Restaurant(
      name: 'Meze Fresh',
      dish: 'Garden Margherita',
      category: 'Pizza',
      rating: '4.9',
      deliveryTime: '25–35 min',
      price: 'RWF 9,000',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=640&auto=format&fit=crop&q=80',
    ),
    _Restaurant(
      name: 'Baso Pâtissier',
      dish: 'Chocolate lava cake',
      category: 'Desserts',
      rating: '4.6',
      deliveryTime: '20–30 min',
      price: 'RWF 4,500',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=640&auto=format&fit=crop&q=80',
    ),
  ];

  final List<_Restaurant> _restaurants = List.of(_initialRestaurants);
  final _searchController = TextEditingController();
  String _selectedCategory = 'All';
  String _searchQuery = '';
  int _cartCount = 0;
  int _selectedTab = 0;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<_Restaurant> get _visibleRestaurants {
    return _restaurants.where((restaurant) {
      final matchesCategory =
          _selectedCategory == 'All' ||
          restaurant.category == _selectedCategory;
      final query = _searchQuery.trim().toLowerCase();
      final matchesSearch =
          query.isEmpty ||
          restaurant.name.toLowerCase().contains(query) ||
          restaurant.dish.toLowerCase().contains(query);
      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLocationHeader(),
                    const SizedBox(height: 24),
                    const Text(
                      'Good food, good mood.',
                      style: TextStyle(
                        fontSize: 26,
                        height: 1.15,
                        fontWeight: FontWeight.w800,
                        color: Color.fromARGB(255, 15, 189, 93),
                      ),
                    ),
                    const SizedBox(height: 7),
                    Text(
                      'Find your next favourite meal',
                      style: TextStyle(
                        color: const Color.fromARGB(255, 14, 202, 61),
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 18),
                    _buildSearchField(),
                    const SizedBox(height: 20),
                    const _DeliveryBanner(),
                    const SizedBox(height: 25),
                    _buildSectionHeader('Explore categories'),
                    const SizedBox(height: 14),
                    _buildCategories(),
                    const SizedBox(height: 25),
                    _buildSectionHeader('Popular near you'),
                    const SizedBox(height: 5),
                  ],
                ),
              ),
            ),
            if (_visibleRestaurants.isEmpty)
              const SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Text(
                      'No meals found. Try another search or category.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color.fromARGB(255, 15, 172, 86)),
                    ),
                  ),
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final restaurant = _visibleRestaurants[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 13),
                      child: _RestaurantCard(
                        restaurant: restaurant,
                        onAdd: () {
                          setState(() {
                            _cartCount++;
                          });
                        },
                        onRemove: () => _removeFood(restaurant),
                      ),
                    );
                  }, childCount: _visibleRestaurants.length),
                ),
              ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedTab,
        onDestinationSelected: (index) {
          setState(() {
            _selectedTab = index;
          });
        },
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: _cartCount > 0,
              label: Text('$_cartCount'),
              child: const Icon(Icons.shopping_bag_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: _cartCount > 0,
              label: Text('$_cartCount'),
              child: const Icon(Icons.shopping_bag_rounded),
            ),
            label: 'Cart',
          ),
          const NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            label: 'Profile',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddFoodDialog,
        backgroundColor: const Color(0xFFE85D32),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Add food'),
      ),
    );
  }

  Future<void> _showAddFoodDialog() async {
    final restaurant = await showDialog<_Restaurant>(
      context: context,
      builder: (context) => const _AddFoodDialog(),
    );
    if (restaurant == null || !mounted) return;

    setState(() {
      _restaurants.insert(0, restaurant);
      _selectedCategory = 'All';
      _searchQuery = '';
      _searchController.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${restaurant.dish} added to the menu')),
    );
  }

  Future<void> _removeFood(_Restaurant restaurant) async {
    final shouldRemove = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove food?'),
        content: Text('Remove ${restaurant.dish} from the menu?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Remove food'),
          ),
        ],
      ),
    );
    if (shouldRemove != true || !mounted) return;

    setState(() {
      _restaurants.remove(restaurant);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${restaurant.dish} removed from the menu')),
    );
  }

  Widget _buildLocationHeader() {
    return Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFFFFE9DF),
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Icon(
            Icons.location_on_rounded,
            color: Color(0xFFE85D32),
          ),
        ),
        const SizedBox(width: 11),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'DELIVERING TO',
                style: TextStyle(
                  fontSize: 10,
                  letterSpacing: 1.1,
                  fontWeight: FontWeight.w700,
                  color: Colors.brown.shade300,
                ),
              ),
              const SizedBox(height: 3),
              const Row(
                children: [
                  Text(
                    'Kigali, Rwanda',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                  ),
                  SizedBox(width: 4),
                  Icon(Icons.keyboard_arrow_down_rounded, size: 18),
                ],
              ),
            ],
          ),
        ),
        IconButton(
          onPressed: () {},
          tooltip: 'Notifications',
          style: IconButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: const Color(0xFF39332E),
          ),
          icon: const Icon(Icons.notifications_none_rounded),
        ),
      ],
    );
  }

  Widget _buildSearchField() {
    return TextField(
      controller: _searchController,
      onChanged: (value) => setState(() => _searchQuery = value),
      decoration: InputDecoration(
        hintText: 'Search dishes or restaurants',
        prefixIcon: const Icon(Icons.search_rounded),
        suffixIcon: IconButton(
          tooltip: 'Filter',
          onPressed: () {},
          icon: const Icon(Icons.tune_rounded),
        ),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Color(0xFF302A26),
            fontSize: 17,
            fontWeight: FontWeight.w800,
          ),
        ),
        TextButton(
          onPressed: () {
            setState(() => _selectedCategory = 'All');
          },
          style: TextButton.styleFrom(
            foregroundColor: const Color(0xFFE85D32),
            padding: EdgeInsets.zero,
            visualDensity: VisualDensity.compact,
          ),
          child: const Text('See all'),
        ),
      ],
    );
  }

  Widget _buildCategories() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final category in _categories)
            Padding(
              padding: const EdgeInsets.only(right: 11),
              child: _CategoryTile(
                category: category,
                selected: category.name == _selectedCategory,
                onTap: () => setState(() {
                  _selectedCategory = category.name;
                }),
              ),
            ),
        ],
      ),
    );
  }
}

class _DeliveryBanner extends StatelessWidget {
  const _DeliveryBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 132,
      width: double.infinity,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: const Color(0xFF3B2921),
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.network(
            'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&auto=format&fit=crop&q=80',
            fit: BoxFit.cover,
            alignment: Alignment.centerRight,
            errorBuilder: (context, error, stackTrace) => const SizedBox(),
          ),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF3B2921).withValues(alpha: 0.96),
                  const Color(0xFF3B2921).withValues(alpha: 0.76),
                  Colors.transparent,
                ],
                stops: const [0, 0.56, 1],
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(18, 19, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'A little joy, delivered',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  'Enjoy 20% off your first order',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
                SizedBox(height: 10),
                Text(
                  'USE CODE  FOODIE20',
                  style: TextStyle(
                    color: Color(0xFFFFC678),
                    fontSize: 10,
                    letterSpacing: 1,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryTile extends StatelessWidget {
  const _CategoryTile({
    required this.category,
    required this.selected,
    required this.onTap,
  });

  final _FoodCategory category;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final foreground = selected ? Colors.white : const Color(0xFF554A43);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 76,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 7),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFFE85D32) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? const Color(0xFFE85D32) : const Color(0xFFF0EAE5),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(category.icon, size: 24, color: foreground),
            const SizedBox(height: 7),
            Text(
              category.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: foreground,
                fontSize: 10,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RestaurantCard extends StatelessWidget {
  const _RestaurantCard({
    required this.restaurant,
    required this.onAdd,
    required this.onRemove,
  });

  final _Restaurant restaurant;
  final VoidCallback onAdd;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF2ECE7)),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(13),
            child: restaurant.imageUrl == null
                ? _foodImagePlaceholder()
                : Image.network(
                    restaurant.imageUrl!,
                    width: 88,
                    height: 94,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        _foodImagePlaceholder(),
                  ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  restaurant.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Color(0xFF302A26),
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  restaurant.dish,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: Colors.brown.shade400, fontSize: 11),
                ),
                const SizedBox(height: 7),
                Row(
                  children: [
                    const Icon(
                      Icons.star_rounded,
                      size: 15,
                      color: Color(0xFFFFAD32),
                    ),
                    const SizedBox(width: 3),
                    Text(
                      restaurant.rating,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(
                      Icons.schedule_rounded,
                      size: 13,
                      color: Colors.brown.shade300,
                    ),
                    const SizedBox(width: 3),
                    Flexible(
                      child: Text(
                        restaurant.deliveryTime,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.brown.shade400,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      restaurant.price,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFFE85D32),
                      ),
                    ),
                    Row(
                      children: [
                        SizedBox(
                          height: 30,
                          width: 34,
                          child: IconButton.filledTonal(
                            onPressed: onRemove,
                            tooltip: 'Remove ${restaurant.dish} from menu',
                            padding: EdgeInsets.zero,
                            style: IconButton.styleFrom(
                              foregroundColor: Colors.red.shade700,
                            ),
                            icon: const Icon(Icons.delete_outline, size: 18),
                          ),
                        ),
                        const SizedBox(width: 6),
                        SizedBox(
                          height: 30,
                          width: 34,
                          child: IconButton.filled(
                            onPressed: onAdd,
                            tooltip: 'Add ${restaurant.dish} to cart',
                            padding: EdgeInsets.zero,
                            style: IconButton.styleFrom(
                              backgroundColor: const Color(0xFFE85D32),
                              foregroundColor: Colors.white,
                            ),
                            icon: const Icon(Icons.add_rounded, size: 19),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FoodCategory {
  const _FoodCategory({required this.name, required this.icon});

  final String name;
  final IconData icon;
}

class _Restaurant {
  const _Restaurant({
    required this.name,
    required this.dish,
    required this.category,
    required this.rating,
    required this.deliveryTime,
    required this.price,
    this.imageUrl,
  });

  final String name;
  final String dish;
  final String category;
  final String rating;
  final String deliveryTime;
  final String price;
  final String? imageUrl;
}

Widget _foodImagePlaceholder() {
  return Container(
    width: 88,
    height: 94,
    color: const Color(0xFFFFE9DF),
    alignment: Alignment.center,
    child: const Icon(
      Icons.restaurant_rounded,
      color: Color(0xFFE85D32),
      size: 30,
    ),
  );
}

class _AddFoodDialog extends StatefulWidget {
  const _AddFoodDialog();

  @override
  State<_AddFoodDialog> createState() => _AddFoodDialogState();
}

class _AddFoodDialogState extends State<_AddFoodDialog> {
  static const _categories = ['African', 'Burgers', 'Pizza', 'Desserts'];

  final _formKey = GlobalKey<FormState>();
  final _foodNameController = TextEditingController();
  final _restaurantController = TextEditingController();
  final _priceController = TextEditingController();
  String _category = _categories.first;

  @override
  void dispose() {
    _foodNameController.dispose();
    _restaurantController.dispose();
    _priceController.dispose();
    super.dispose();
  }

  void _saveFood() {
    if (!_formKey.currentState!.validate()) return;

    final price = int.parse(_priceController.text.trim());
    final priceText = price.toString().replaceAllMapped(
      RegExp(r'\B(?=(\d{3})+(?!\d))'),
      (match) => ',',
    );
    Navigator.of(context).pop(
      _Restaurant(
        name: _restaurantController.text.trim(),
        dish: _foodNameController.text.trim(),
        category: _category,
        rating: 'New',
        deliveryTime: '20–30 min',
        price: 'RWF $priceText',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add a new food'),
      scrollable: true,
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              key: const Key('food-name-field'),
              controller: _foodNameController,
              decoration: const InputDecoration(labelText: 'Food name'),
              textCapitalization: TextCapitalization.sentences,
              validator: _requiredValidator,
            ),
            TextFormField(
              key: const Key('restaurant-name-field'),
              controller: _restaurantController,
              decoration: const InputDecoration(labelText: 'Restaurant'),
              textCapitalization: TextCapitalization.words,
              validator: _requiredValidator,
            ),
            TextFormField(
              key: const Key('food-price-field'),
              controller: _priceController,
              decoration: const InputDecoration(labelText: 'Price (RWF)'),
              keyboardType: TextInputType.number,
              validator: (value) {
                final price = int.tryParse(value?.trim() ?? '');
                if (price == null || price <= 0) {
                  return 'Enter a valid price';
                }
                return null;
              },
            ),
            DropdownButtonFormField<String>(
              initialValue: _category,
              decoration: const InputDecoration(labelText: 'Category'),
              items: [
                for (final category in _categories)
                  DropdownMenuItem(value: category, child: Text(category)),
              ],
              onChanged: (value) {
                if (value != null) {
                  setState(() => _category = value);
                }
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(onPressed: _saveFood, child: const Text('Save food')),
      ],
    );
  }
}

String? _requiredValidator(String? value) {
  if (value == null || value.trim().isEmpty) {
    return 'This field is required';
  }
  return null;
}
