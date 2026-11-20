import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_mobileapplicationproject_1/main.dart';

void main() {
  testWidgets('category selection filters nearby meals', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const FoodieApp());

    await tester.tap(find.text('Burgers'));
    await tester.drag(find.byType(CustomScrollView), const Offset(0, -600));
    await tester.pumpAndSettle();

    expect(find.text('Burger House'), findsOneWidget);
    expect(find.text('The Hut'), findsNothing);
  });

  testWidgets('adding a meal updates the cart badge', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const FoodieApp());

    await tester.drag(find.byType(CustomScrollView), const Offset(0, -600));
    await tester.pumpAndSettle();
    final addButton = find.byTooltip('Add Brochettes & fries to cart');
    await tester.tap(addButton);
    await tester.pumpAndSettle();

    expect(find.text('1'), findsOneWidget);
  });

  testWidgets('new food can be added to the menu', (WidgetTester tester) async {
    await tester.pumpWidget(const FoodieApp());

    await tester.tap(find.text('Add food'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byKey(const Key('food-name-field')),
      'Kigali Special',
    );
    await tester.enterText(
      find.byKey(const Key('restaurant-name-field')),
      'Mama Africa',
    );
    await tester.enterText(find.byKey(const Key('food-price-field')), '12500');
    await tester.tap(find.text('Save food'));
    await tester.pumpAndSettle();

    await tester.drag(find.byType(CustomScrollView), const Offset(0, -600));
    await tester.pumpAndSettle();

    expect(find.text('Kigali Special'), findsOneWidget);
    expect(find.text('RWF 12,500'), findsOneWidget);
  });

  testWidgets('food can be removed from the menu', (WidgetTester tester) async {
    await tester.pumpWidget(const FoodieApp());

    await tester.drag(find.byType(CustomScrollView), const Offset(0, -600));
    await tester.pumpAndSettle();

    await tester.tap(find.byTooltip('Remove Brochettes & fries from menu'));
    await tester.pumpAndSettle();
    expect(
      find.text('Remove Brochettes & fries from the menu?'),
      findsOneWidget,
    );

    await tester.tap(find.text('Remove food'));
    await tester.pumpAndSettle();

    expect(find.text('Brochettes & fries'), findsNothing);
    expect(
      find.text('Brochettes & fries removed from the menu'),
      findsOneWidget,
    );
  });
}
