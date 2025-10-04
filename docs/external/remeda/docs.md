# Documentation

## Guides

# Intro

Welcome to the Remeda documentation and API reference. Below, you’ll find the
complete reference for all functions exported by Remeda.

## Previous Versions

Are you using version 1.x.x? Visit our [migration guide](https://remedajs.com/migrate/v1) to
help you transition to the latest version.

* * *

## array

allPass

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/allPass.ts "View source on Github")

Determines whether all predicates returns true for the input data.

###### Data First

```
R.allPass(data, fns);
```

Expand

```
const isDivisibleBy3 = (x: number) => x % 3 === 0;
const isDivisibleBy4 = (x: number) => x % 4 === 0;
const fns = [isDivisibleBy3, isDivisibleBy4];
R.allPass(12, fns); // => true
R.allPass(8, fns); // => false
```

###### Data Last

```
R.allPass(fns)(data);
```

Expand

```
const isDivisibleBy3 = (x: number) => x % 3 === 0;
const isDivisibleBy4 = (x: number) => x % 4 === 0;
const fns = [isDivisibleBy3, isDivisibleBy4];
R.allPass(fns)(12); // => true
R.allPass(fns)(8); // => false
```

anyPass

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/anyPass.ts "View source on Github")

Determines whether any predicate returns true for the input data.

###### Data First

```
R.anyPass(data, fns);
```

Expand

```
const isDivisibleBy3 = (x: number) => x % 3 === 0;
const isDivisibleBy4 = (x: number) => x % 4 === 0;
const fns = [isDivisibleBy3, isDivisibleBy4];
R.anyPass(8, fns); // => true
R.anyPass(11, fns); // => false
```

###### Data Last

```
R.anyPass(fns)(data);
```

Expand

```
const isDivisibleBy3 = (x: number) => x % 3 === 0;
const isDivisibleBy4 = (x: number) => x % 4 === 0;
const fns = [isDivisibleBy3, isDivisibleBy4];
R.anyPass(fns)(8); // => true
R.anyPass(fns)(11); // => false
```

chunk

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/chunk.ts "View source on Github")

Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.

###### Data First

```
R.chunk(array, size);
```

Expand

```
R.chunk(["a", "b", "c", "d"], 2); // => [['a', 'b'], ['c', 'd']]
R.chunk(["a", "b", "c", "d"], 3); // => [['a', 'b', 'c'], ['d']]
```

###### Data Last

```
R.chunk(size)(array);
```

Expand

```
R.chunk(2)(["a", "b", "c", "d"]); // => [['a', 'b'], ['c', 'd']]
R.chunk(3)(["a", "b", "c", "d"]); // => [['a', 'b', 'c'], ['d']]
```

concat

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/concat.ts "View source on Github")

Merge two or more arrays. This method does not change the existing arrays,
but instead returns a new array, even if the other array is empty.

###### Data First

```
R.concat(data, other);
```

Expand

```
R.concat([1, 2, 3], ["a"]); // [1, 2, 3, 'a']
```

###### Data Last

```
R.concat(arr2)(arr1);
```

Expand

```
R.concat(["a"])([1, 2, 3]); // [1, 2, 3, 'a']
```

countBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/countBy.ts "View source on Github")

Categorize and count elements in an array using a defined callback function.
The callback function is applied to each element in the array to determine
its category and then counts how many elements fall into each category.

###### Data First

```
R.countBy(data, categorizationFn);
```

Expand

```
R.countBy(["a", "b", "c", "B", "A", "a"], R.toLowerCase()); //=> { a: 3, b: 2, c: 1 }
```

###### Data Last

```
R.countBy(categorizationFn)(data);
```

Expand

```
R.pipe(["a", "b", "c", "B", "A", "a"], R.countBy(R.toLowerCase())); //=> { a: 3, b: 2, c: 1 }
```

difference

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/difference.ts "View source on Github")

Excludes the values from `other` array. The output maintains the same order
as the input. The inputs are treated as multi-sets/bags (multiple copies of
items are treated as unique items).

###### Data First

```
R.difference(data, other);
```

Expand

```
R.difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
R.difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
```

###### Data First

```
R.difference(other)(data);
```

Expand

```
R.pipe([1, 2, 3, 4], R.difference([2, 5, 3])); // => [1, 4]
R.pipe([1, 1, 2, 2], R.difference([1])); // => [1, 2, 2]
```

differenceWith

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/differenceWith.ts "View source on Github")

Excludes the values from `other` array.
Elements are compared by custom comparator isEquals.

###### Data First

```
R.differenceWith(data, other, isEqual);
```

Expand

```
R.differenceWith(
  [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }],
  [2, 5, 3],
  ({ a }, b) => a === b,
); //=> [{ a: 1 }, { a: 4 }]
```

###### Data Last

```
R.differenceWith(other, isEqual)(data);
```

Expand

```
R.pipe(
  [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
  R.differenceWith([2, 3], ({ a }, b) => a === b),
); //=> [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 6 }]
```

drop

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/drop.ts "View source on Github")

Removes first `n` elements from the `array`.

###### Data First

```
R.drop(array, n);
```

Expand

```
R.drop([1, 2, 3, 4, 5], 2); // => [3, 4, 5]
```

###### Data Last

```
R.drop(n)(array);
```

Expand

```
R.drop(2)([1, 2, 3, 4, 5]); // => [3, 4, 5]
```

dropFirstBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/dropFirstBy.ts "View source on Github")

Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is _O(Nlogn)_ where `N` is the length of the array.

For the opposite operation (to keep `n` elements) see [`takeFirstBy`](https://remedajs.com/docs/#takeFirstBy).

###### Data First

```
R.dropFirstBy(data, n, ...rules);
```

Expand

```
R.dropFirstBy(["aa", "aaaa", "a", "aaa"], 2, (x) => x.length); // => ['aaa', 'aaaa']
```

###### Data Last

```
R.dropFirstBy(n, ...rules)(data);
```

Expand

```
R.pipe(
  ["aa", "aaaa", "a", "aaa"],
  R.dropFirstBy(2, (x) => x.length),
); // => ['aaa', 'aaaa']
```

dropLast

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/dropLast.ts "View source on Github")

Removes last `n` elements from the `array`.

###### Data First

```
R.dropLast(array, n);
```

Expand

```
R.dropLast([1, 2, 3, 4, 5], 2); // => [1, 2, 3]
```

###### Data Last

```
R.dropLast(n)(array);
```

Expand

```
R.dropLast(2)([1, 2, 3, 4, 5]); // => [1, 2, 3]
```

dropLastWhile

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/dropLastWhile.ts "View source on Github")

Removes elements from the end of the array until the predicate returns false.

The predicate is applied to each element in the array starting from the end and moving towards the beginning, until the predicate returns false. The returned array includes elements from the beginning of the array, up to and including the element that produced false for the predicate.

###### Data First

```
R.dropLastWhile(data, predicate);
```

Expand

```
R.dropLastWhile([1, 2, 10, 3, 4], (x) => x < 10); // => [1, 2, 10]
```

###### Data Last

```
R.dropLastWhile(predicate)(data);
```

Expand

```
R.pipe(
  [1, 2, 10, 3, 4],
  R.dropLastWhile((x) => x < 10),
); // => [1, 2, 10]
```

dropWhile

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/dropWhile.ts "View source on Github")

Removes elements from the beginning of the array until the predicate returns false.

The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.

###### Data First

```
R.dropWhile(data, predicate);
```

Expand

```
R.dropWhile([1, 2, 10, 3, 4], (x) => x < 10); // => [10, 3, 4]
```

###### Data Last

```
R.dropWhile(predicate)(data);
```

Expand

```
R.pipe(
  [1, 2, 10, 3, 4],
  R.dropWhile((x) => x < 10),
); // => [10, 3, 4]
```

filter

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/filter.ts "View source on Github")

Creates a shallow copy of a portion of a given array, filtered down to just
the elements from the given array that pass the test implemented by the
provided function. Equivalent to `Array.prototype.filter`.

###### Data First

```
R.filter(data, predicate);
```

Expand

```
R.filter([1, 2, 3], (x) => x % 2 === 1); // => [1, 3]
```

###### Data Last

```
R.filter(predicate)(data);
```

Expand

```
R.pipe(
  [1, 2, 3],
  R.filter((x) => x % 2 === 1),
); // => [1, 3]
```

find

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/find.ts "View source on Github")

Returns the first element in the provided array that satisfies the provided
testing function. If no values satisfy the testing function, `undefined` is
returned.

Similar functions:

- [`findLast`](https://remedajs.com/docs/#findLast) \- If you need the last element that satisfies the provided testing function.
- [`findIndex`](https://remedajs.com/docs/#findIndex) \- If you need the index of the found element in the array.
- `indexOf` \- If you need to find the index of a value.
- `includes` \- If you need to find if a value exists in an array.
- `some` \- If you need to find if any element satisfies the provided testing function.
- [`filter`](https://remedajs.com/docs/#filter) \- If you need to find all elements that satisfy the provided testing function.

###### Data First

```
R.find(data, predicate);
```

Expand

```
R.find([1, 3, 4, 6], (n) => n % 2 === 0); // => 4
```

###### Data Last

```
R.find(predicate)(data);
```

Expand

```
R.pipe(
  [1, 3, 4, 6],
  R.find((n) => n % 2 === 0),
); // => 4
```

findIndex

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/findIndex.ts "View source on Github")

Returns the index of the first element in an array that satisfies the
provided testing function. If no elements satisfy the testing function, -1 is
returned.

See also the [`find`](https://remedajs.com/docs/#find) method, which returns the first element that satisfies
the testing function (rather than its index).

###### Data First

```
R.findIndex(data, predicate);
```

Expand

```
R.findIndex([1, 3, 4, 6], (n) => n % 2 === 0); // => 2
```

###### Data Last

```
R.findIndex(predicate)(data);
```

Expand

```
R.pipe(
  [1, 3, 4, 6],
  R.findIndex((n) => n % 2 === 0),
); // => 2
```

findLast

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/findLast.ts "View source on Github")

Iterates the array in reverse order and returns the value of the first
element that satisfies the provided testing function. If no elements satisfy
the testing function, undefined is returned.

Similar functions:

- [`find`](https://remedajs.com/docs/#find) \- If you need the first element that satisfies the provided testing function.
- [`findLastIndex`](https://remedajs.com/docs/#findLastIndex) \- If you need the index of the found element in the array.
- `lastIndexOf` \- If you need to find the index of a value.
- `includes` \- If you need to find if a value exists in an array.
- `some` \- If you need to find if any element satisfies the provided testing function.
- [`filter`](https://remedajs.com/docs/#filter) \- If you need to find all elements that satisfy the provided testing function.

###### Data First

```
R.findLast(data, predicate);
```

Expand

```
R.findLast([1, 3, 4, 6], (n) => n % 2 === 1); // => 3
```

###### Data Last

```
R.findLast(predicate)(data);
```

Expand

```
R.pipe(
  [1, 3, 4, 6],
  R.findLast((n) => n % 2 === 1),
); // => 3
```

findLastIndex

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/findLastIndex.ts "View source on Github")

Iterates the array in reverse order and returns the index of the first
element that satisfies the provided testing function. If no elements satisfy
the testing function, -1 is returned.

See also [`findLast`](https://remedajs.com/docs/#findLast) which returns the value of last element that satisfies
the testing function (rather than its index).

###### Data First

```
R.findLastIndex(data, predicate);
```

Expand

```
R.findLastIndex([1, 3, 4, 6], (n) => n % 2 === 1); // => 1
```

###### Data Last

```
R.findLastIndex(fn)(items);
```

Expand

```
R.pipe(
  [1, 3, 4, 6],
  R.findLastIndex((n) => n % 2 === 1),
); // => 1
```

first

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/first.ts "View source on Github")

Gets the first element of `array`.

###### Data First

```
R.first(array);
```

Expand

```
R.first([1, 2, 3]); // => 1
R.first([]); // => undefined
```

###### Data Last

```
R.first()(array);
```

Expand

```
R.pipe(
  [1, 2, 4, 8, 16],
  R.filter((x) => x > 3),
  R.first(),
  (x) => x + 1,
); // => 5
```

firstBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/firstBy.ts "View source on Github")

Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic. This function is equivalent to calling `R.first(R.sortBy(...))` but runs at _O(n)_ instead of _O(nlogn)_.

Use [`nthBy`](https://remedajs.com/docs/#nthBy) if you need an element other that the first, or [`takeFirstBy`](https://remedajs.com/docs/#takeFirstBy) if you more than just the first element.

###### Data First

```
R.firstBy(data, ...rules);
```

Expand

```
const max = R.firstBy([1, 2, 3], [R.identity(), "desc"]); // => 3;
const min = R.firstBy([1, 2, 3], R.identity()); // => 1;

const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
const maxBy = R.firstBy(data, [(item) => item.a.length, "desc"]); // => { a: "aaa" };
const minBy = R.firstBy(data, (item) => item.a.length); // => { a: "a" };

const data = [\
  { type: "cat", size: 1 },\
  { type: "cat", size: 2 },\
  { type: "dog", size: 3 },\
] as const;
const multi = R.firstBy(data, R.prop("type"), [R.prop("size"), "desc"]); // => {type: "cat", size: 2}
```

###### Data Last

```
R.firstBy(...rules)(data);
```

Expand

```
const max = R.pipe([1, 2, 3], R.firstBy([R.identity(), "desc"])); // => 3;
const min = R.pipe([1, 2, 3], R.firstBy(R.identity())); // => 1;

const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
const maxBy = R.pipe(data, R.firstBy([(item) => item.a.length, "desc"])); // => { a: "aaa" };
const minBy = R.pipe(
  data,
  R.firstBy((item) => item.a.length),
); // => { a: "a" };

const data = [\
  { type: "cat", size: 1 },\
  { type: "cat", size: 2 },\
  { type: "dog", size: 3 },\
] as const;
const multi = R.pipe(data, R.firstBy(R.prop("type"), [R.prop("size"), "desc"])); // => {type: "cat", size: 2}
```

flat

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/flat.ts "View source on Github")

Creates a new array with all sub-array elements concatenated into it
recursively up to the specified depth. Equivalent to the built-in
`Array.prototype.flat` method.

###### Data First

```
R.flat(data);
R.flat(data, depth);
```

Expand

```
R.flat([[1, 2], [3, 4], [5], [[6]]]); // => [1, 2, 3, 4, 5, [6]]
R.flat([[[1]], [[2]]], 2); // => [1, 2]
```

###### Data Last

```
R.flat()(data);
R.flat(depth)(data);
```

Expand

```
R.pipe([[1, 2], [3, 4], [5], [[6]]], R.flat()); // => [1, 2, 3, 4, 5, [6]]
R.pipe([[[1]], [[2]]], R.flat(2)); // => [1, 2]
```

flatMap

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/flatMap.ts "View source on Github")

Returns a new array formed by applying a given callback function to each
element of the array, and then flattening the result by one level. It is
identical to a [`map`](https://remedajs.com/docs/#map) followed by a [`flat`](https://remedajs.com/docs/#flat) of depth 1
( `flat(map(data, ...args))`), but slightly more efficient than calling those
two methods separately. Equivalent to `Array.prototype.flatMap`.

###### Data First

```
R.flatMap(data, callbackfn);
```

Expand

```
R.flatMap([1, 2, 3], (x) => [x, x * 10]); // => [1, 10, 2, 20, 3, 30]
```

###### Data Last

```
R.flatMap(callbackfn)(data);
```

Expand

```
R.pipe(
  [1, 2, 3],
  R.flatMap((x) => [x, x * 10]),
); // => [1, 10, 2, 20, 3, 30]
```

forEach

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/forEach.ts "View source on Github")

Executes a provided function once for each array element. Equivalent to
`Array.prototype.forEach`.

The dataLast version returns the original array (instead of not returning
anything ( `void`)) to allow using it in a pipe. When not used in a [`pipe`](https://remedajs.com/docs/#pipe) the
returned array is equal to the input array (by reference), and not a shallow
copy of it!

###### Data First

```
R.forEach(data, callbackfn);
```

Expand

```
R.forEach([1, 2, 3], (x) => {
  console.log(x);
});
```

###### Data Last

```
R.forEach(callbackfn)(data);
```

Expand

```
R.pipe(
  [1, 2, 3],
  R.forEach((x) => {
    console.log(x);
  }),
); // => [1, 2, 3]
```

groupBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/groupBy.ts "View source on Github")

Groups the elements of a given iterable according to the string values
returned by a provided callback function. The returned object has separate
properties for each group, containing arrays with the elements in the group.
Unlike the built in `Object.groupBy` this function also allows the callback to
return `undefined` in order to exclude the item from being added to any
group.

If you are grouping objects by a property of theirs (e.g.
`groupBy(data, ({ myProp }) => myProp)` or `groupBy(data, prop('myProp'))`)
consider using [`groupByProp`](https://remedajs.com/docs/#groupByProp) (e.g. `groupByProp(data, 'myProp')`) instead,
as it would provide better typing.

###### Data First

```
R.groupBy(data, callbackfn);
```

Expand

```
R.groupBy([{ a: "cat" }, { a: "dog" }] as const, R.prop("a")); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
R.groupBy([0, 1], (x) => (x % 2 === 0 ? "even" : undefined)); // => {even: [0]}
```

###### Data Last

```
R.groupBy(callbackfn)(data);
```

Expand

```
R.pipe([{ a: "cat" }, { a: "dog" }] as const, R.groupBy(R.prop("a"))); // => {cat: [{a: 'cat'}], dog: [{a: 'dog'}]}
R.pipe(
  [0, 1],
  R.groupBy((x) => (x % 2 === 0 ? "even" : undefined)),
); // => {even: [0]}
```

groupByProp

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/groupByProp.ts "View source on Github")

Groups the elements of an array of objects based on the values of a
specified property of those objects. The result would contain a property for
each unique value of the specific property, with it's value being the input
array filtered to only items that have that property set to that value.
For any object where the property is missing, or if it's value is
`undefined` the item would be filtered out.

The grouping property is enforced at the type level to exist in at least one
item and to never have a value that cannot be used as an object key (e.g. it
must be `PropertyKey | undefined`).

The resulting arrays are filtered with the prop and it's value as a
type-guard, effectively narrowing the items in each output arrays. This
means that when the grouping property is the discriminator of a
discriminated union type each output array would contain just the subtype for
that value.

If you need more control over the grouping you should use [`groupBy`](https://remedajs.com/docs/#groupBy) instead.

###### Data First

```
R.groupByProp(data, prop);
```

Expand

```
const result = R.groupByProp(
  //  ^? { cat: [{ a: 'cat' }], dog: [{ a: 'dog' }] }
  [{ a: "cat" }, { a: "dog" }] as const,
  "a",
);
```

###### Data Last

```
R.groupByProp(prop)(data);
```

Expand

```
const result = R.pipe(
  //  ^? { cat: [{ a: 'cat' }], dog: [{ a: 'dog' }] }
  [{ a: "cat" }, { a: "dog" }] as const,
  R.groupByProp("a"),
);
```

hasAtLeast

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/hasAtLeast.ts "View source on Github")

Checks if the given array has at least the defined number of elements. When
the minimum used is a literal (e.g. `3`) the output is refined accordingly so
that those indices are defined when accessing the array even when using
typescript's 'noUncheckedIndexAccess'.

###### Data First

```
R.hasAtLeast(data, minimum);
```

Expand

```
R.hasAtLeast([], 4); // => false

const data: number[] = [1, 2, 3, 4];
R.hasAtLeast(data, 1); // => true
data[0]; // 1, with type `number`
```

###### Data Last

```
R.hasAtLeast(minimum)(data);
```

Expand

```
R.pipe([], R.hasAtLeast(4)); // => false

const data = [[1, 2], [3], [4, 5]];
R.pipe(
  data,
  R.filter(R.hasAtLeast(2)),
  R.map(([, second]) => second),
); // => [2,5], with type `number[]`
```

indexBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/indexBy.ts "View source on Github")

Converts a list of objects into an object indexing the objects by the given
key.

There are several other functions that could be used to build an object from
an array:

- [`fromKeys`](https://remedajs.com/docs/#fromKeys) \- Builds an object from an array of _keys_ and a mapper for values.
- [`pullObject`](https://remedajs.com/docs/#pullObject) \- Builds an object from an array of items with mappers for _both_ keys and values.
- [`fromEntries`](https://remedajs.com/docs/#fromEntries) \- Builds an object from an array of key-value pairs.
Refer to the docs for more details.

###### Data First

```
R.indexBy(array, fn);
```

Expand

```
R.indexBy(["one", "two", "three"], (x) => x.length); // => {3: 'two', 5: 'three'}
```

###### Data Last

```
R.indexBy(fn)(array);
```

Expand

```
R.pipe(
  ["one", "two", "three"],
  R.indexBy((x) => x.length),
); // => {3: 'two', 5: 'three'}
```

intersection

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/intersection.ts "View source on Github")

Returns a list of elements that exist in both array. The output maintains the
same order as the input. The inputs are treated as multi-sets/bags (multiple
copies of items are treated as unique items).

###### Data First

```
R.intersection(data, other);
```

Expand

```
R.intersection([1, 2, 3], [2, 3, 5]); // => [2, 3]
R.intersection([1, 1, 2, 2], [1]); // => [1]
```

###### Data First

```
R.intersection(other)(data);
```

Expand

```
R.pipe([1, 2, 3], R.intersection([2, 3, 5])); // => [2, 3]
R.pipe([1, 1, 2, 2], R.intersection([1])); // => [1]
```

intersectionWith

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/intersectionWith.ts "View source on Github")

Returns a list of intersecting values based on a custom
comparator function that compares elements of both arrays.

###### Data First

```
R.intersectionWith(array, other, comparator);
```

Expand

```
R.intersectionWith(
  [\
    { id: 1, name: "Ryan" },\
    { id: 3, name: "Emma" },\
  ],
  [3, 5],
  (a, b) => a.id === b,
); // => [{ id: 3, name: 'Emma' }]
```

###### Data Last

```
R.intersectionWith(other, comparator)(array);
```

Expand

```
R.intersectionWith(
  [3, 5],
  (a, b) => a.id === b,
)([\
  { id: 1, name: "Ryan" },\
  { id: 3, name: "Emma" },\
]); // => [{ id: 3, name: 'Emma' }]
```

join

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/join.ts "View source on Github")

Joins the elements of the array by: casting them to a string and
concatenating them one to the other, with the provided glue string in between
every two elements.

When called on a tuple and with stricter item types (union of literal values,
the result is strictly typed to the tuples shape and it's item types).

###### Data First

```
R.join(data, glue);
```

Expand

```
R.join([1, 2, 3], ","); // => "1,2,3" (typed `string`)
R.join(["a", "b", "c"], ""); // => "abc" (typed `string`)
R.join(["hello", "world"] as const, " "); // => "hello world" (typed `hello world`)
```

###### Data Last

```
R.join(glue)(data);
```

Expand

```
R.pipe([1, 2, 3], R.join(",")); // => "1,2,3" (typed `string`)
R.pipe(["a", "b", "c"], R.join("")); // => "abc" (typed `string`)
R.pipe(["hello", "world"] as const, R.join(" ")); // => "hello world" (typed `hello world`)
```

last

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/last.ts "View source on Github")

Gets the last element of `array`.

###### Data First

```
R.last(array);
```

Expand

```
R.last([1, 2, 3]); // => 3
R.last([]); // => undefined
```

###### Data Last

```
R.last()(array);
```

Expand

```
R.pipe(
  [1, 2, 4, 8, 16],
  R.filter((x) => x > 3),
  R.last(),
  (x) => x + 1,
); // => 17
```

length

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/length.ts "View source on Github")

Counts values of the collection or iterable.

###### Data First

```
R.length(array);
```

Expand

```
R.length([1, 2, 3]); // => 3
```

###### Data Last

```
R.length()(array);
```

Expand

```
R.pipe([1, 2, 3], R.length()); // => 3
```

map

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/map.ts "View source on Github")

Creates a new array populated with the results of calling a provided function
on every element in the calling array. Equivalent to `Array.prototype.map`.

###### Data First

```
R.map(data, callbackfn);
```

Expand

```
R.map([1, 2, 3], R.multiply(2)); // => [2, 4, 6]
R.map([0, 0], R.add(1)); // => [1, 1]
R.map([0, 0], (value, index) => value + index); // => [0, 1]
```

###### Data Last

```
R.map(callbackfn)(data);
```

Expand

```
R.pipe([1, 2, 3], R.map(R.multiply(2))); // => [2, 4, 6]
R.pipe([0, 0], R.map(R.add(1))); // => [1, 1]
R.pipe(
  [0, 0],
  R.map((value, index) => value + index),
); // => [0, 1]
```

mapToObj

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/mapToObj.ts "View source on Github")

Map each element of an array into an object using a defined mapper that
converts each item into an object entry (a tuple of `[<key>, <value>]`).

There are several other functions that could be used to build an object from
an array:

- [`fromKeys`](https://remedajs.com/docs/#fromKeys) \- Builds an object from an array of _keys_ and a mapper for
values.
- [`indexBy`](https://remedajs.com/docs/#indexBy) \- Builds an object from an array of _values_ and a mapper for
keys.
- [`pullObject`](https://remedajs.com/docs/#pullObject) \- Builds an object from an array of items with a mapper for
values and another mapper for keys.
- [`fromEntries`](https://remedajs.com/docs/#fromEntries) \- Builds an object from an array of key-value pairs.

**Warning**: We strongly advise against using this function unless it is
used with a huge input array and your app has stringent memory/gc
constraints. We recommend that in most cases you should use [`pullObject`](https://remedajs.com/docs/#pullObject),
or the composition `fromEntries(map(array, fn))`. This function will be
deprecated and **removed** in future versions of the library!

###### Data First

```
R.mapToObj(array, fn);
```

Expand

```
R.mapToObj([1, 2, 3], (x) => [String(x), x * 2]); // => {1: 2, 2: 4, 3: 6}
```

###### Data Last

```
R.mapToObj(fn)(array);
```

Expand

```
R.pipe(
  [1, 2, 3],
  R.mapToObj((x) => [String(x), x * 2]),
); // => {1: 2, 2: 4, 3: 6}
```

mapWithFeedback

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/mapWithFeedback.ts "View source on Github")

Applies a function on each element of the array, using the result of the
previous application, and returns an array of the successively computed
values.

###### Data First

```
R.mapWithFeedback(data, callbackfn, initialValue);
```

Expand

```
R.mapWithFeedback([1, 2, 3, 4, 5], (prev, x) => prev + x, 100); // => [101, 103, 106, 110, 115]
```

###### Data Last

```
R.mapWithFeedback(callbackfn, initialValue)(data);
```

Expand

```
R.pipe(
  [1, 2, 3, 4, 5],
  R.mapWithFeedback((prev, x) => prev + x, 100),
); // => [101, 103, 106, 110, 115]
```

meanBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/meanBy.ts "View source on Github")

Returns the mean of the elements of an array using the provided predicate.

###### Data First

```
R.meanBy(array, fn);
```

Expand

```
R.meanBy([{ a: 5 }, { a: 1 }, { a: 3 }], (x) => x.a); // 3
```

###### Data Last

```
R.meanBy(fn)(array);
```

Expand

```
R.pipe(
  [{ a: 5 }, { a: 1 }, { a: 3 }],
  R.meanBy((x) => x.a),
); // 3
```

mergeAll

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/mergeAll.ts "View source on Github")

Merges a list of objects into a single object.

###### Data First

```
R.mergeAll(objects);
```

Expand

```
R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]); // => { a: 1, b: 2, c: 3, d: 10 }
R.mergeAll([]); // => {}
```

nthBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/nthBy.ts "View source on Github")

Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the _QuickSelect_ algorithm running at an average complexity of _O(n)_. Semantically it is equivalent to `sortBy(data, ...rules).at(index)` which would run at _O(nlogn)_.

See also [`firstBy`](https://remedajs.com/docs/#firstBy) which provides an even more efficient algorithm and a stricter return type, but only for `index === 0`. See [`takeFirstBy`](https://remedajs.com/docs/#takeFirstBy) to get all the elements up to and including `index`.

###### Data First

```
R.nthBy(data, index, ...rules);
```

Expand

```
R.nthBy([2, 1, 4, 5, 3], 2, identity()); // => 3
```

###### Data Last

```
R.nthBy(index, ...rules)(data);
```

Expand

```
R.pipe([2, 1, 4, 5, 3], R.nthBy(2, identity())); // => 3
```

only

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/only.ts "View source on Github")

Returns the first and only element of `array`, or undefined otherwise.

###### Data First

```
R.only(array);
```

Expand

```
R.only([]); // => undefined
R.only([1]); // => 1
R.only([1, 2]); // => undefined
```

###### Data Last

```
R.only()(array);
```

Expand

```
R.pipe([], R.only()); // => undefined
R.pipe([1], R.only()); // => 1
R.pipe([1, 2], R.only()); // => undefined
```

partition

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/partition.ts "View source on Github")

Splits a collection into two groups, the first of which contains elements the
`predicate` type guard passes, and the second one containing the rest.

###### Data First

```
R.partition(data, predicate);
```

Expand

```
R.partition(["one", "two", "forty two"], (x) => x.length === 3); // => [['one', 'two'], ['forty two']]
```

###### Data Last

```
R.partition(predicate)(data);
```

Expand

```
R.pipe(
  ["one", "two", "forty two"],
  R.partition((x) => x.length === 3),
); // => [['one', 'two'], ['forty two']]
```

range

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/range.ts "View source on Github")

Returns a list of numbers from `start` (inclusive) to `end` (exclusive).

###### Data First

```
range(start, end);
```

Expand

```
R.range(1, 5); // => [1, 2, 3, 4]
```

###### Data Last

```
range(end)(start);
```

Expand

```
R.range(5)(1); // => [1, 2, 3, 4]
```

rankBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/rankBy.ts "View source on Github")

Calculates the rank of an item in an array based on `rules`. The rank is the position where the item would appear in the sorted array. This function provides an efficient way to determine the rank in _O(n)_ time, compared to _O(nlogn)_ for the equivalent `sortedIndex(sortBy(data, ...rules), item)`.

###### Data First

```
R.rankBy(data, item, ...rules);
```

Expand

```
const DATA = [{ a: 5 }, { a: 1 }, { a: 3 }] as const;
R.rankBy(DATA, 0, R.prop("a")); // => 0
R.rankBy(DATA, 1, R.prop("a")); // => 1
R.rankBy(DATA, 2, R.prop("a")); // => 1
R.rankBy(DATA, 3, R.prop("a")); // => 2
```

###### Data Last

```
R.rankBy(item, ...rules)(data);
```

Expand

```
const DATA = [{ a: 5 }, { a: 1 }, { a: 3 }] as const;
R.pipe(DATA, R.rankBy(0, R.prop("a"))); // => 0
R.pipe(DATA, R.rankBy(1, R.prop("a"))); // => 1
R.pipe(DATA, R.rankBy(2, R.prop("a"))); // => 1
R.pipe(DATA, R.rankBy(3, R.prop("a"))); // => 2
```

reduce

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/reduce.ts "View source on Github")

Executes a user-supplied "reducer" callback function on each element of the
array, in order, passing in the return value from the calculation on the
preceding element. The final result of running the reducer across all
elements of the array is a single value. Equivalent to
`Array.prototype.reduce`.

###### Data First

```
R.reduce(data, callbackfn, initialValue);
```

Expand

```
R.reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100); // => 115
```

###### Data Last

```
R.reduce(fn, initialValue)(array);
```

Expand

```
R.pipe(
  [1, 2, 3, 4, 5],
  R.reduce((acc, x) => acc + x, 100),
); // => 115
```

reverse

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/reverse.ts "View source on Github")

Reverses array.

###### Data First

```
R.reverse(arr);
```

Expand

```
R.reverse([1, 2, 3]); // [3, 2, 1]
```

###### Data Last

```
R.reverse()(array);
```

Expand

```
R.reverse()([1, 2, 3]); // [3, 2, 1]
```

sample

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sample.ts "View source on Github")

Returns a random subset of size `sampleSize` from `array`.

Maintains and infers most of the typing information that could be passed
along to the output. This means that when using tuples, the output will be
a tuple too, and when using literals, those literals would be preserved.

The items in the result are kept in the same order as they are in the input.
If you need to get a shuffled response you can pipe the shuffle function
after this one.

###### Data First

```
R.sample(array, sampleSize);
```

Expand

```
R.sample(["hello", "world"], 1); // => ["hello"] // typed string[]
R.sample(["hello", "world"] as const, 1); // => ["world"] // typed ["hello" | "world"]
```

###### Data Last

```
R.sample(sampleSize)(array);
```

Expand

```
R.sample(1)(["hello", "world"]); // => ["hello"] // typed string[]
R.sample(1)(["hello", "world"] as const); // => ["world"] // typed ["hello" | "world"]
```

shuffle

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/shuffle.ts "View source on Github")

Shuffles the input array, returning a new array with the same elements in a random order.

###### Data First

```
R.shuffle(array);
```

Expand

```
R.shuffle([4, 2, 7, 5]); // => [7, 5, 4, 2]
```

###### Data Last

```
R.shuffle()(array);
```

Expand

```
R.pipe([4, 2, 7, 5], R.shuffle()); // => [7, 5, 4, 2]
```

sort

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sort.ts "View source on Github")

Sorts an array. The comparator function should accept two values at a time
and return a negative number if the first value is smaller, a positive number
if it's larger, and zero if they are equal. Sorting is based on a native
[`sort`](https://remedajs.com/docs/#sort) function.

###### Data First

```
R.sort(items, cmp);
```

Expand

```
R.sort([4, 2, 7, 5], (a, b) => a - b); // => [2, 4, 5, 7]
```

###### Data Last

```
R.sort(cmp)(items);
```

Expand

```
R.pipe(
  [4, 2, 7, 5],
  R.sort((a, b) => a - b),
); // => [2, 4, 5, 7]
```

sortBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sortBy.ts "View source on Github")

Sorts `data` using the provided ordering rules. The [`sort`](https://remedajs.com/docs/#sort) is done via the
native `Array.prototype.sort` but is performed on a shallow copy of the array
to avoid mutating the original data.

There are several other functions that take order rules and **bypass** the
need to sort the array first (in _O(nlogn)_ time):

- [`firstBy`](https://remedajs.com/docs/#firstBy) === `first(sortBy(data, ...rules))`, O(n).
- [`takeFirstBy`](https://remedajs.com/docs/#takeFirstBy) === `take(sortBy(data, ...rules), k)`, O(nlogk).
- [`dropFirstBy`](https://remedajs.com/docs/#dropFirstBy) === `drop(sortBy(data, ...rules), k)`, O(nlogk).
- [`nthBy`](https://remedajs.com/docs/#nthBy) === `sortBy(data, ...rules).at(k)`, O(n).
- [`rankBy`](https://remedajs.com/docs/#rankBy) === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
Refer to the docs for more details.

###### Data First

```
R.sortBy(data, ...rules);
```

Expand

```
R.sortBy([{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }], prop("a")); // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
R.sortBy(
  [\
    { color: "red", weight: 2 },\
    { color: "blue", weight: 3 },\
    { color: "green", weight: 1 },\
    { color: "purple", weight: 1 },\
  ],
  [prop("weight"), "asc"],
  prop("color"),
); // => [\
//   {color: 'green', weight: 1},\
//   {color: 'purple', weight: 1},\
//   {color: 'red', weight: 2},\
//   {color: 'blue', weight: 3},\
// ]
```

###### Data Last

```
R.sortBy(...rules)(data);
```

Expand

```
R.pipe([{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }], R.sortBy(R.prop("a"))); // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
```

sortedIndex

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sortedIndex.ts "View source on Github")

Find the insertion position (index) of an item in an array with items sorted
in ascending order; so that `splice(sortedIndex, 0, item)` would result in
maintaining the array's sort-ness. The array can contain duplicates.
If the item already exists in the array the index would be of the _first_
occurrence of the item.

Runs in O(logN) time.

###### Data First

```
R.sortedIndex(data, item);
```

Expand

```
R.sortedIndex(["a", "a", "b", "c", "c"], "c"); // => 3
```

###### Data Last

```
R.sortedIndex(item)(data);
```

Expand

```
R.pipe(["a", "a", "b", "c", "c"], R.sortedIndex("c")); // => 3
```

sortedIndexBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sortedIndexBy.ts "View source on Github")

Find the insertion position (index) of an item in an array with items sorted
in ascending order using a value function; so that
`splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
ness. The array can contain duplicates.
If the item already exists in the array the index would be of the _first_
occurrence of the item.

Runs in O(logN) time.

See also:

- [`findIndex`](https://remedajs.com/docs/#findIndex) \- scans a possibly unsorted array in-order (linear search).
- [`sortedIndex`](https://remedajs.com/docs/#sortedIndex) \- like this function, but doesn't take a callbackfn.
- [`sortedLastIndexBy`](https://remedajs.com/docs/#sortedLastIndexBy) \- like this function, but finds the last suitable index.
- [`sortedLastIndex`](https://remedajs.com/docs/#sortedLastIndex) \- like [`sortedIndex`](https://remedajs.com/docs/#sortedIndex), but finds the last suitable index.
- [`rankBy`](https://remedajs.com/docs/#rankBy) \- scans a possibly unsorted array in-order, returning the index based on a sorting criteria.

###### Data First

```
R.sortedIndexBy(data, item, valueFunction);
```

Expand

```
R.sortedIndexBy([{ age: 20 }, { age: 22 }], { age: 21 }, prop("age")); // => 1
```

sortedIndexWith

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sortedIndexWith.ts "View source on Github")

Performs a **binary search** for the index of the item at which the predicate
stops returning `true`. This function assumes that the array is "sorted" in
regards to the predicate, meaning that running the predicate as a mapper on
it would result in an array `[...true[], ...false[]]`.
This stricter requirement from the predicate provides us 2 benefits over
[`findIndex`](https://remedajs.com/docs/#findIndex) which does a similar thing:

1. It would run at O(logN) time instead of O(N) time.
2. It always returns a value (it would return `data.length` if the
predicate returns `true` for all items).

This function is the basis for all other sortedIndex functions which search
for a specific item in a sorted array, and it could be used to perform
similar efficient searches.

- [`sortedIndex`](https://remedajs.com/docs/#sortedIndex) \- scans a sorted array with a binary search, find the first suitable index.
- [`sortedIndexBy`](https://remedajs.com/docs/#sortedIndexBy) \- like [`sortedIndex`](https://remedajs.com/docs/#sortedIndex), but assumes sorting is based on a callbackfn.
- [`sortedLastIndex`](https://remedajs.com/docs/#sortedLastIndex) \- scans a sorted array with a binary search, finding the last suitable index.
- [`sortedLastIndexBy`](https://remedajs.com/docs/#sortedLastIndexBy) \- like [`sortedLastIndex`](https://remedajs.com/docs/#sortedLastIndex), but assumes sorting is based on a callbackfn.

See also:

- [`findIndex`](https://remedajs.com/docs/#findIndex) \- scans a possibly unsorted array in-order (linear search).
- [`rankBy`](https://remedajs.com/docs/#rankBy) \- scans a possibly unsorted array in-order, returning the index based on a sorting criteria.

###### Data First

```
R.sortedIndexWith(data, predicate);
```

Expand

```
R.sortedIndexWith(["a", "ab", "abc"], (item) => item.length < 2); // => 1
```

###### Data Last

```
R.sortedIndexWith(predicate)(data);
```

Expand

```
R.pipe(
  ["a", "ab", "abc"],
  R.sortedIndexWith((item) => item.length < 2),
); // => 1
```

sortedLastIndex

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sortedLastIndex.ts "View source on Github")

Find the insertion position (index) of an item in an array with items sorted
in ascending order; so that `splice(sortedIndex, 0, item)` would result in
maintaining the array's sort-ness. The array can contain duplicates.
If the item already exists in the array the index would be of the _last_
occurrence of the item.

Runs in O(logN) time.

###### Data First

```
R.sortedLastIndex(data, item);
```

Expand

```
R.sortedLastIndex(["a", "a", "b", "c", "c"], "c"); // => 5
```

###### Data Last

```
R.sortedLastIndex(item)(data);
```

Expand

```
R.pipe(["a", "a", "b", "c", "c"], sortedLastIndex("c")); // => 5
```

sortedLastIndexBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sortedLastIndexBy.ts "View source on Github")

Find the insertion position (index) of an item in an array with items sorted
in ascending order using a value function; so that
`splice(sortedIndex, 0, item)` would result in maintaining the arrays sort-
ness. The array can contain duplicates.
If the item already exists in the array the index would be of the _last_
occurrence of the item.

Runs in O(logN) time.

See also:

- [`findIndex`](https://remedajs.com/docs/#findIndex) \- scans a possibly unsorted array in-order (linear search).
- [`sortedLastIndex`](https://remedajs.com/docs/#sortedLastIndex) \- a simplified version of this function, without a callbackfn.
- [`sortedIndexBy`](https://remedajs.com/docs/#sortedIndexBy) \- like this function, but returns the first suitable index.
- [`sortedIndex`](https://remedajs.com/docs/#sortedIndex) \- like [`sortedLastIndex`](https://remedajs.com/docs/#sortedLastIndex) but without a callbackfn.
- [`rankBy`](https://remedajs.com/docs/#rankBy) \- scans a possibly unsorted array in-order, returning the index based on a sorting criteria.

###### Data First

```
R.sortedLastIndexBy(data, item, valueFunction);
```

Expand

```
R.sortedLastIndexBy([{ age: 20 }, { age: 22 }], { age: 21 }, prop("age")); // => 1
```

###### Data Last

```
R.sortedLastIndexBy(item, valueFunction)(data);
```

Expand

```
R.pipe([{ age: 20 }, { age: 22 }], sortedLastIndexBy({ age: 21 }, prop("age"))); // => 1
```

splice

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/splice.ts "View source on Github")

Removes elements from an array and, inserts new elements in their place.

###### Data First

```
R.splice(items, start, deleteCount, replacement);
```

Expand

```
R.splice([1, 2, 3, 4, 5, 6, 7, 8], 2, 3, []); //=> [1,2,6,7,8]
R.splice([1, 2, 3, 4, 5, 6, 7, 8], 2, 3, [9, 10]); //=> [1,2,9,10,6,7,8]
```

###### Data Last

```
R.splice(start, deleteCount, replacement)(items);
```

Expand

```
R.pipe([1, 2, 3, 4, 5, 6, 7, 8], R.splice(2, 3, [])); // => [1,2,6,7,8]
R.pipe([1, 2, 3, 4, 5, 6, 7, 8], R.splice(2, 3, [9, 10])); // => [1,2,9,10,6,7,8]
```

splitAt

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/splitAt.ts "View source on Github")

Splits a given array at a given index.

###### Data First

```
R.splitAt(array, index);
```

Expand

```
R.splitAt([1, 2, 3], 1); // => [[1], [2, 3]]
R.splitAt([1, 2, 3, 4, 5], -1); // => [[1, 2, 3, 4], [5]]
```

###### Data Last

```
R.splitAt(index)(array);
```

Expand

```
R.splitAt(1)([1, 2, 3]); // => [[1], [2, 3]]
R.splitAt(-1)([1, 2, 3, 4, 5]); // => [[1, 2, 3, 4], [5]]
```

splitWhen

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/splitWhen.ts "View source on Github")

Splits a given array at the first index where the given predicate returns true.

###### Data First

```
R.splitWhen(array, fn);
```

Expand

```
R.splitWhen([1, 2, 3], (x) => x === 2); // => [[1], [2, 3]]
```

###### Data Last

```
R.splitWhen(fn)(array);
```

Expand

```
R.splitWhen((x) => x === 2)([1, 2, 3]); // => [[1], [2, 3]]
```

sumBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sumBy.ts "View source on Github")

Returns the sum of the elements of an array using the provided mapper.

Works for both `number` and `bigint` mappers, but not mappers that return both
types.

IMPORTANT: The result for empty arrays would be 0 ( `number`) regardless of
the type of the mapper; to avoid adding this to the return type for cases
where the array is known to be non-empty you can use [`hasAtLeast`](https://remedajs.com/docs/#hasAtLeast) or
[`isEmpty`](https://remedajs.com/docs/#isEmpty) to guard against this case.

###### Data First

```
R.sumBy(array, fn);
```

Expand

```
R.sumBy([{ a: 5 }, { a: 1 }, { a: 3 }], (x) => x.a); // 9
R.sumBy([{ a: 5n }, { a: 1n }, { a: 3n }], (x) => x.a); // 9n
```

###### Data Last

```
R.sumBy(fn)(array);
```

Expand

```
R.pipe(
  [{ a: 5 }, { a: 1 }, { a: 3 }],
  R.sumBy((x) => x.a),
); // 9

R.pipe(
  [{ a: 5n }, { a: 1n }, { a: 3n }],
  R.sumBy((x) => x.a),
); // 9n
```

swapIndices

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/swapIndices.ts "View source on Github")

Swaps the positions of two elements in an array or string at the provided indices.

Negative indices are supported and would be treated as an offset from the end of the array. The resulting type thought would be less strict than when using positive indices.

If either index is out of bounds the result would be a shallow copy of the input, as-is.

###### Data First

```
swapIndices(data, index1, index2);
```

Expand

```
swapIndices(["a", "b", "c"], 0, 1); // => ['b', 'a', 'c']
swapIndices(["a", "b", "c"], 1, -1); // => ['a', 'c', 'b']
swapIndices("abc", 0, 1); // => 'bac'
```

###### Data Last

```
swapIndices(index1, index2)(data);
```

Expand

```
swapIndices(0, 1)(["a", "b", "c"]); // => ['b', 'a', 'c']
swapIndices(0, -1)("abc"); // => 'cba'
```

take

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/take.ts "View source on Github")

Returns the first `n` elements of `array`.

###### Data First

```
R.take(array, n);
```

Expand

```
R.take([1, 2, 3, 4, 3, 2, 1], 3); // => [1, 2, 3]
```

###### Data Last

```
R.take(n)(array);
```

Expand

```
R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)); // => [1, 2, 3]
```

takeFirstBy

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/takeFirstBy.ts "View source on Github")

Take the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before taking the items. The complexity of this function is _O(Nlogn)_ where `N` is the length of the array.

For the opposite operation (to drop `n` elements) see [`dropFirstBy`](https://remedajs.com/docs/#dropFirstBy).

###### Data First

```
R.takeFirstBy(data, n, ...rules);
```

Expand

```
R.takeFirstBy(["aa", "aaaa", "a", "aaa"], 2, (x) => x.length); // => ['a', 'aa']
```

###### Data Last

```
R.takeFirstBy(n, ...rules)(data);
```

Expand

```
R.pipe(
  ["aa", "aaaa", "a", "aaa"],
  R.takeFirstBy(2, (x) => x.length),
); // => ['a', 'aa']
```

takeLast

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/takeLast.ts "View source on Github")

Takes the last `n` elements from the `array`.

###### Data First

```
R.takeLast(array, n);
```

Expand

```
R.takeLast([1, 2, 3, 4, 5], 2); // => [4, 5]
```

###### Data Last

```
R.takeLast(n)(array);
```

Expand

```
R.takeLast(2)([1, 2, 3, 4, 5]); // => [4, 5]
```

takeLastWhile

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/takeLastWhile.ts "View source on Github")

Returns elements from the end of the array until the predicate returns false.
The returned elements will be in the same order as in the original array.

###### Data First

```
R.takeLastWhile(data, predicate);
```

Expand

```
R.takeLastWhile([1, 2, 10, 3, 4, 5], (x) => x < 10); // => [3, 4, 5]
```

###### Data Last

```
R.takeLastWhile(predicate)(data);
```

Expand

```
R.pipe(
  [1, 2, 10, 3, 4, 5],
  R.takeLastWhile((x) => x < 10),
); // => [3, 4, 5]
```

takeWhile

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/takeWhile.ts "View source on Github")

Returns elements from the array until predicate returns false.

###### Data First

```
R.takeWhile(data, predicate);
```

Expand

```
R.takeWhile([1, 2, 3, 4, 3, 2, 1], (x) => x !== 4); // => [1, 2, 3]
```

###### Data Last

```
R.takeWhile(predicate)(data);
```

Expand

```
R.pipe(
  [1, 2, 3, 4, 3, 2, 1],
  R.takeWhile((x) => x !== 4),
); // => [1, 2, 3]
```

times

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/times.ts "View source on Github")

Calls an input function `n` times, returning an array containing the results
of those function calls.

`fn` is passed one argument: The current value of `n`, which begins at `0`
and is gradually incremented to `n - 1`.

###### Data First

```
R.times(count, fn);
```

Expand

```
R.times(5, R.identity()); //=> [0, 1, 2, 3, 4]
```

###### Data Last

```
R.times(fn)(count);
```

Expand

```
R.times(R.identity())(5); //=> [0, 1, 2, 3, 4]
```

unique

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/unique.ts "View source on Github")

Returns a new array containing only one copy of each element in the original
list. Elements are compared by reference using Set.

###### Data First

```
R.unique(array);
```

Expand

```
R.unique([1, 2, 2, 5, 1, 6, 7]); // => [1, 2, 5, 6, 7]
```

###### Data Last

```
R.unique()(array);
```

Expand

```
R.pipe(
  [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
  R.unique(),
  R.take(3),
); // => [1, 2, 5]
```

uniqueBy

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/uniqueBy.ts "View source on Github")

Returns a new array containing only one copy of each element in the original
list transformed by a function. Elements are compared by reference using Set.

###### Data First

```
R.uniqueBy(data, keyFunction);
```

Expand

```
R.uniqueBy(
  [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
  (obj) => obj.n,
); // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
```

###### Data Last

```
R.uniqueBy(keyFunction)(data);
```

Expand

```
R.pipe(
  [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }], // only 4 iterations
  R.uniqueBy((obj) => obj.n),
  R.take(3),
); // => [{n: 1}, {n: 2}, {n: 5}]
```

uniqueWith

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/uniqueWith.ts "View source on Github")

Returns a new array containing only one copy of each element in the original
list. Elements are compared by custom comparator isEquals.

###### Data First

```
R.uniqueWith(array, isEquals);
```

Expand

```
R.uniqueWith(
  [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }],
  R.equals,
); // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
```

###### Data Last

```
R.uniqueWith(isEquals)(array);
```

Expand

```
R.uniqueWith(R.equals)([\
  { a: 1 },\
  { a: 2 },\
  { a: 2 },\
  { a: 5 },\
  { a: 1 },\
  { a: 6 },\
  { a: 7 },\
]); // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
R.pipe(
  [{ a: 1 }, { a: 2 }, { a: 2 }, { a: 5 }, { a: 1 }, { a: 6 }, { a: 7 }], // only 4 iterations
  R.uniqueWith(R.equals),
  R.take(3),
); // => [{a: 1}, {a: 2}, {a: 5}]
```

zip

LazyArray [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/zip.ts "View source on Github")

Creates a new list from two supplied lists by pairing up equally-positioned
items. The length of the returned list will match the shortest of the two
inputs.

###### Data First

```
R.zip(first, second);
```

Expand

```
R.zip([1, 2], ["a", "b"]); // => [[1, 'a'], [2, 'b']]
```

###### Data Last

```
R.zip(second)(first);
```

Expand

```
R.zip(["a", "b"])([1, 2]); // => [[1, 'a'], [2, 'b']]
```

zipWith

Array [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/zipWith.ts "View source on Github")

Creates a new list from two supplied lists by calling the supplied function
with the same-positioned element from each list.

```
R.zipWith(fn)(first, second);
```

Expand

```
R.zipWith((a: string, b: string) => a + b)(["1", "2", "3"], ["a", "b", "c"]); // => ['1a', '2b', '3c']
```

###### Data First

```
R.zipWith(first, second, fn);
```

Expand

```
R.zipWith(["1", "2", "3"], ["a", "b", "c"], (a, b) => a + b); // => ['1a', '2b', '3c']
```

###### Data Last

```
R.zipWith(second, fn)(first);
```

Expand

```
R.pipe(
  ["1", "2", "3"],
  R.zipWith(["a", "b", "c"], (a, b) => a + b),
); // => ['1a', '2b', '3c']
```

## function

conditional

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/conditional.ts "View source on Github")

Executes a transformer function based on the first matching predicate,
functioning like a series of `if...else if...` statements. It sequentially
evaluates each case and, upon finding a truthy predicate, runs the
corresponding transformer, and returns, ignoring any further cases, even if
they would match.

_NOTE_: Some type-predicates may fail to narrow the param type of their
transformer; in such cases wrap your type-predicate in an anonymous arrow
function: e.g., instead of
`conditional(..., [myTypePredicate, myTransformer], ...)`, use
`conditional(..., [($) => myTypePredicate($), myTransformer], ...)`.

To add a a default, catch-all, case you can provide a single callback
function (instead of a 2-tuple) as the last case. This is equivalent to
adding a case with a trivial always-true predicate as it's condition (see
example).

For simpler cases you should also consider using [`when`](https://remedajs.com/docs/#when) instead.

Due to TypeScript's inability to infer the result of negating a type-
predicate we can't refine the types used in subsequent cases based on
previous conditions. Using a `switch (true)` statement or ternary operators
is recommended for more precise type control when such type narrowing is
needed.

!IMPORTANT! - Unlike similar implementations in Lodash and Ramda, the Remeda
implementation **doesn't** implicitly return `undefined` as a fallback when
when none of the cases match; and instead **throws** an exception in those
cases! You have to explicitly provide a default case, and can use
`constant(undefined)` as your last case to replicate that behavior.

###### Data First

```
R.conditional(data, ...cases);
```

Expand

```
const nameOrId = 3 as string | number | boolean;

R.conditional(
  nameOrId,
  [R.isString, (name) => `Hello ${name}`],
  [R.isNumber, (id) => `Hello ID: ${id}`],
); //=> 'Hello ID: 3' (typed as `string`), can throw!.

R.conditional(
  nameOrId,
  [R.isString, (name) => `Hello ${name}`],
  [R.isNumber, (id) => `Hello ID: ${id}`],
  R.constant(undefined),
); //=> 'Hello ID: 3' (typed as `string | undefined`), won't throw.

R.conditional(
  nameOrId,
  [R.isString, (name) => `Hello ${name}`],
  [R.isNumber, (id) => `Hello ID: ${id}`],
  (something) => `Hello something (${JSON.stringify(something)})`,
); //=> 'Hello ID: 3' (typed as `string`), won't throw.
```

###### Data Last

```
R.conditional(...cases)(data);
```

Expand

```
const nameOrId = 3 as string | number | boolean;

R.pipe(
  nameOrId,
  R.conditional(
    [R.isString, (name) => `Hello ${name}`],
    [R.isNumber, (id) => `Hello ID: ${id}`],
  ),
); //=> 'Hello ID: 3' (typed as `string`), can throw!.

R.pipe(
  nameOrId,
  R.conditional(
    [R.isString, (name) => `Hello ${name}`],
    [R.isNumber, (id) => `Hello ID: ${id}`],
    R.constant(undefined),
  ),
); //=> 'Hello ID: 3' (typed as `string | undefined`), won't throw.

R.pipe(
  nameOrId,
  R.conditional(
    [R.isString, (name) => `Hello ${name}`],
    [R.isNumber, (id) => `Hello ID: ${id}`],
    (something) => `Hello something (${JSON.stringify(something)})`,
  ),
); //=> 'Hello ID: 3' (typed as `string`), won't throw.
```

constant

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/constant.ts "View source on Github")

A function that takes any arguments and returns the provided `value` on every
invocation. This is useful to provide trivial implementations for APIs or in
combination with a ternary or other conditional execution to allow to short-
circuit more complex implementations for a specific case.

Notice that this is a dataLast impl where the function needs to be invoked
to get the "do nothing" function.

See also:
[`doNothing`](https://remedajs.com/docs/#doNothing) \- A function that doesn't return anything.
[`identity`](https://remedajs.com/docs/#identity) \- A function that returns the first argument it receives.

###### Data Last

```
R.constant(value);
```

Expand

```
R.map([1, 2, 3], R.constant("a")); // => ['a', 'a', 'a']
R.map([1, 2, 3], isDemoMode ? R.add(1) : R.constant(0)); // => [2, 3, 4] or [0, 0, 0]
```

debounce

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/debounce.ts "View source on Github")

Wraps `func` with a debouncer object that "debounces" (delays) invocations of the function during a defined cool-down period ( `waitMs`). It can be configured to invoke the function either at the start of the cool-down period, the end of it, or at both ends ( `timing`).
It can also be configured to allow invocations during the cool-down period ( `maxWaitMs`).
It stores the latest call's arguments so they could be used at the end of the cool-down period when invoking `func` (if configured to invoke the function at the end of the cool-down period).
It stores the value returned by `func` whenever its invoked. This value is returned on every call, and is accessible via the `cachedValue` property of the debouncer. Its important to note that the value might be different from the value that would be returned from running `func` with the current arguments as it is a cached value from a previous invocation.
**Important**: The cool-down period defines the minimum between two invocations, and not the maximum. The period will be **extended** each time a call is made until a full cool-down period has elapsed without any additional calls.

! **DEPRECATED**: This implementation of debounce is known to have issues and might not behave as expected. It should be replaced with the [`funnel`](https://remedajs.com/docs/#funnel) utility instead. The test file [funnel.remeda-debounce.test.ts](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.remeda-debounce.test.ts) offers a reference implementation that replicates [`debounce`](https://remedajs.com/docs/#debounce) via [`funnel`](https://remedajs.com/docs/#funnel)!

###### Data First

```
R.debounce(func, options);
```

Expand

```
const debouncer = debounce(identity(), { timing: "trailing", waitMs: 1000 });
const result1 = debouncer.call(1); // => undefined
const result2 = debouncer.call(2); // => undefined
// after 1 second
const result3 = debouncer.call(3); // => 2
// after 1 second
debouncer.cachedValue; // => 3
```

doNothing

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/doNothing.ts "View source on Github")

A function that takes any arguments and does nothing with them. This is
useful as a placeholder for any function or API that requires a **void**
function (a function that doesn't return a value). This could also be used in
combination with a ternary or other conditional execution to allow disabling
a function call for a specific case.

Notice that this is a dataLast impl where the function needs to be invoked
to get the "do nothing" function.

See also:

- [`constant`](https://remedajs.com/docs/#constant) \- A function that ignores it's arguments and returns the same value on every invocation.
- [`identity`](https://remedajs.com/docs/#identity) \- A function that returns the first argument it receives.

###### Data Last

```
R.doNothing();
```

Expand

```
myApi({ onSuccess: handleSuccess, onError: R.doNothing() });
myApi({ onSuccess: isDemoMode ? R.doNothing() : handleSuccess });
```

funnel

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.ts "View source on Github")

Creates a funnel that controls the timing and execution of `callback`. Its
main purpose is to manage multiple consecutive (usually fast-paced) calls,
reshaping them according to a defined batching strategy and timing policy.
This is useful when handling uncontrolled call rates, such as DOM events or
network traffic. It can implement strategies like debouncing, throttling,
batching, and more.

An optional `reducer` function can be provided to allow passing data to the
callback via calls to `call` (otherwise the signature of `call` takes no
arguments).

Typing is inferred from `callback` s param, and from the rest params that
the optional `reducer` function accepts. Use **explicit** types for these
to ensure that everything _else_ is well-typed.

Notice that this function constructs a funnel **object**, and does **not**
execute anything when called. The returned object should be used to execute
the funnel via the its `call` method.

- Debouncing: use `minQuietPeriodMs` and any `triggerAt`.
- Throttling: use `minGapMs` and `triggerAt: "start"` or `"both"`.
- Batching: See the reference implementation in [`funnel.reference-batch.test.ts`](https://github.com/remeda/remeda/blob/main/packages/remeda/src/funnel.reference-batch.test.ts).

```
R.funnel(callback, options);
```

Expand

```
const debouncer = R.funnel(
  () => {
    console.log("Callback executed!");
  },
  { minQuietPeriodMs: 100 },
);
debouncer.call();
debouncer.call();

const throttle = R.funnel(
  () => {
    console.log("Callback executed!");
  },
  { minGapMs: 100, triggerAt: "start" },
);
throttle.call();
throttle.call();
```

identity

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/identity.ts "View source on Github")

A function that returns the first argument passed to it.

Notice that this is a dataLast impl where the function needs to be invoked
to get the "do nothing" function.

See also:

- [`doNothing`](https://remedajs.com/docs/#doNothing) \- A function that doesn't return anything.
- [`constant`](https://remedajs.com/docs/#constant) \- A function that ignores the input arguments and returns the same value on every invocation.

```
R.identity();
```

Expand

```
R.map([1, 2, 3], R.identity()); // => [1,2,3]
```

once

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/once.ts "View source on Github")

Creates a function that is restricted to invoking `func` once. Repeat calls to the function return the value of the first invocation.

```
R.once(fn);
```

Expand

```
const initialize = R.once(createApplication);
initialize();
initialize();
// => `createApplication` is invoked once
```

partialBind

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/partialBind.ts "View source on Github")

Creates a function that calls `func` with `partial` put before the arguments
it receives.

Can be thought of as "freezing" some portion of a function's arguments,
resulting in a new function with a simplified signature.

###### Data First

```
R.partialBind(func, ...partial);
```

Expand

```
const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
const partialFn = R.partialBind(fn, 1, 2);
partialFn(3); //=> 123

const logWithPrefix = R.partialBind(console.log, "[prefix]");
logWithPrefix("hello"); //=> "[prefix] hello"
```

partialLastBind

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/partialLastBind.ts "View source on Github")

Creates a function that calls `func` with `partial` put after the arguments
it receives. Note that this doesn't support functions with both optional
and rest parameters.

Can be thought of as "freezing" some portion of a function's arguments,
resulting in a new function with a simplified signature.

Useful for converting a data-first function to a data-last one.

###### Data First

```
R.partialLastBind(func, ...partial);
```

Expand

```
const fn = (x: number, y: number, z: number) => x * 100 + y * 10 + z;
const partialFn = R.partialLastBind(fn, 2, 3);
partialFn(1); //=> 123

const parseBinary = R.partialLastBind(parseInt, "2");
parseBinary("101"); //=> 5

R.pipe(
  { a: 1 },
  // instead of (arg) => JSON.stringify(arg, null, 2)
  R.partialLastBind(JSON.stringify, null, 2),
); //=> '{\n  "a": 1\n}'
```

pipe

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/pipe.ts "View source on Github")

Performs left-to-right function composition, passing data through functions
in sequence. Each function receives the output of the previous function,
creating a readable top-to-bottom data flow that matches how the
transformation is executed. This enables converting deeply nested function
calls into clear, sequential steps without temporary variables.

When consecutive functions with a `lazy` tag (e.g., [`map`](https://remedajs.com/docs/#map), [`filter`](https://remedajs.com/docs/#filter), [`take`](https://remedajs.com/docs/#take),
[`drop`](https://remedajs.com/docs/#drop), [`forEach`](https://remedajs.com/docs/#forEach), etc...) are used together, they process data item-by-item
rather than creating intermediate arrays. This enables early termination
when only partial results are needed, improving performance for large
datasets and expensive operations.

Functions are only evaluated lazily when their data-last form is used
directly in the pipe. To disable lazy evaluation, use data-first calls via
arrow functions: `($) => map($, callback)` instead of `map(callback)`.

Any function can be used in pipes, not just Remeda utilities. For creating
custom functions with currying and lazy evaluation support, see the [`purry`](https://remedajs.com/docs/#purry)
utility.

A "headless" variant [`piped`](https://remedajs.com/docs/#piped) is available for creating reusable pipe
functions without initial data.

IMPORTANT: During lazy evaluation, callbacks using the third parameter (the
input array) receive only items processed up to that point, not the complete
array.

###### Data First

```
R.pipe(data, ...functions);
```

Expand

```
R.pipe([1, 2, 3], R.map(R.multiply(3))); //=> [3, 6, 9]

// = Early termination with lazy evaluation =
R.pipe(
  hugeArray,
  R.map(expensiveComputation),
  R.filter(complexPredicate),
  // Only processes items until 2 results are found, then stops.
  // Most of hugeArray never gets processed.
  R.take(2),
);

// = Custom logic within a pipe =
R.pipe(
  input,
  R.toLowerCase(),
  normalize,
  ($) => validate($, CONFIG),
  R.split(","),
  R.unique(),
);

// = Migrating nested transformations to pipes =
// Nested
const result = R.prop(
  R.mapValues(R.groupByProp(users, "department"), R.length()),
  "engineering",
);

// Piped
const result = R.pipe(
  users,
  R.groupByProp("department"),
  R.mapValues(R.length()),
  R.prop("engineering"),
);

// = Using the 3rd param of a callback =
// The following would print out `data` in its entirety for each value
// of `data`.
R.forEach([1, 2, 3, 4], (_item, _index, data) => {
  console.log(data);
}); //=> "[1, 2, 3, 4]" logged 4 times

// But with `pipe` data would only contain the items up to the current
// index
R.pipe(
  [1, 2, 3, 4],
  R.forEach((_item, _index, data) => {
    console.log(data);
  }),
); //=> "[1]", "[1, 2]", "[1, 2, 3]", "[1, 2, 3, 4]"
```

piped

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/piped.ts "View source on Github")

Data-last version of [`pipe`](https://remedajs.com/docs/#pipe). See [`pipe`](https://remedajs.com/docs/#pipe) documentation for full details.

Use [`piped`](https://remedajs.com/docs/#piped) when you need to pass a transformation as a callback to
functions like [`map`](https://remedajs.com/docs/#map) and [`filter`](https://remedajs.com/docs/#filter), where the data type can be inferred
from the call site.

IMPORTANT: [`piped`](https://remedajs.com/docs/#piped) does not work as a "function factory" in order to create
standalone utility functions; because TypeScript cannot infer the input data
type (without requiring to explicitly define all type params for all
functions in the pipe). We recommend defining the function explicitly, and
then use [`pipe`](https://remedajs.com/docs/#pipe) in its implementation.

###### Data Last

```
R.piped(...functions)(data);
```

Expand

```
R.map([{ a: 1 }, { a: 2 }, { a: 3 }], R.piped(R.prop("a"), R.add(1))); //=> [2, 3, 4]
```

purry

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/purry.ts "View source on Github")

Creates a function with `dataFirst` and `dataLast` signatures.

[`purry`](https://remedajs.com/docs/#purry) is a dynamic function and it's not type safe. It should be wrapped by
a function that have proper typings. Refer to the example below for correct
usage.

!IMPORTANT: functions that simply call [`purry`](https://remedajs.com/docs/#purry) and return the result (like
almost all functions in this library) should return `unknown` themselves if
an explicit return type is required. This is because we currently don't
provide a generic return type that is built from the input function, and
crafting one manually isn't worthwhile as we rely on function declaration
overloading to combine the types for dataFirst and dataLast invocations!

```
R.purry(fn, args);
```

Expand

```
function _findIndex(array, fn) {
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return i;
    }
  }
  return -1;
}

// data-first
function findIndex<T>(array: T[], fn: (item: T) => boolean): number;

// data-last
function findIndex<T>(fn: (item: T) => boolean): (array: T[]) => number;

function findIndex(...args: unknown[]) {
  return R.purry(_findIndex, args);
}
```

when

Function [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/when.ts "View source on Github")

Conditionally run a function based on a predicate, returning it's result (similar to
the [`?:` (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).)
If the optional `onFalse` function is not provided, the data will be passed
through in those cases.

Supports type predicates to refine the types for both branches and the return
value.

Additional arguments are passed to all functions. In data-first calls, they
are taken as variadic arguments; but in data-last calls, they are when the
curried function itself is called.

For more complex cases check out [`conditional`](https://remedajs.com/docs/#conditional).

###### Data First

```
when(data, predicate, onTrue, ...extraArgs);
when(data, predicate, { onTrue, onFalse }, ...extraArgs);
```

Expand

```
when(data, isNullish, constant(42));
when(data, (x) => x > 3, { onTrue: add(1), onFalse: multiply(2) });
when(data, isString, (x, radix) => parseInt(x, radix), 10);
```

###### Data Last

```
when(predicate, onTrue)(data, ...extraArgs);
when(predicate, { onTrue, onFalse })(data, ...extraArgs);
```

Expand

```
pipe(data, when(isNullish, constant(42)));
pipe(
  data,
  when((x) => x > 3, { onTrue: add(1), onFalse: multiply(2) }),
);
map(
  data,
  when(isNullish, (x, index) => x + index),
);
```

## guard

hasSubObject

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/hasSubObject.ts "View source on Github")

Checks if `subObject` is a sub-object of `object`, which means for every
property and value in `subObject`, there's the same property in `object`
with an equal value. Equality is checked with [`isDeepEqual`](https://remedajs.com/docs/#isDeepEqual).

###### Data First

```
R.hasSubObject(data, subObject);
```

Expand

```
R.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }); //=> true
R.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }); //=> false
R.hasSubObject({ a: 1, b: 2, c: 3 }, {}); //=> true
```

###### Data Last

```
R.hasSubObject(subObject)(data);
```

Expand

```
R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }); //=> true
R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }); //=> false
R.hasSubObject({})({ a: 1, b: 2, c: 3 }); //=> true
```

isArray

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isArray.ts "View source on Github")

A function that checks if the passed parameter is an Array and narrows its type accordingly.

```
R.isArray(data);
```

Expand

```
R.isArray([5]); //=> true
R.isArray([]); //=> true
R.isArray("somethingElse"); //=> false
```

isBigInt

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isBigInt.ts "View source on Github")

A function that checks if the passed parameter is a bigint and narrows its
type accordingly.

```
R.isBigInt(data);
```

Expand

```
R.isBigInt(1n); // => true
R.isBigInt(1); // => false
R.isBigInt("notANumber"); // => false
```

isBoolean

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isBoolean.ts "View source on Github")

A function that checks if the passed parameter is a boolean and narrows its type accordingly.

```
R.isBoolean(data);
```

Expand

```
R.isBoolean(true); //=> true
R.isBoolean(false); //=> true
R.isBoolean("somethingElse"); //=> false
```

isDate

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isDate.ts "View source on Github")

A function that checks if the passed parameter is a Date and narrows its type accordingly.

```
R.isDate(data);
```

Expand

```
R.isDate(new Date()); //=> true
R.isDate("somethingElse"); //=> false
```

isDeepEqual

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isDeepEqual.ts "View source on Github")

Performs a _deep structural_ comparison between two values to determine if
they are equivalent. For primitive values this is equivalent to `===`, for
arrays the check would be performed on every item recursively, in order, and
for objects all props will be compared recursively.

The built-in Date and RegExp are special-cased and will be compared by their
values.

!IMPORTANT: TypedArrays and symbol properties of objects are not supported
right now and might result in unexpected behavior. Please open an issue in
the Remeda github project if you need support for these types.

The result would be narrowed to the second value so that the function can be
used as a type guard.

See:

- [`isStrictEqual`](https://remedajs.com/docs/#isStrictEqual) if you don't need a deep comparison and just want to
check for simple ( `===`, `Object.is`) equality.
- [`isShallowEqual`](https://remedajs.com/docs/#isShallowEqual) if you need to compare arrays and objects "by-value" but
don't want to recurse into their values.

###### Data First

```
R.isDeepEqual(data, other);
```

Expand

```
R.isDeepEqual(1, 1); //=> true
R.isDeepEqual(1, "1"); //=> false
R.isDeepEqual([1, 2, 3], [1, 2, 3]); //=> true
```

###### Data Last

```
R.isDeepEqual(other)(data);
```

Expand

```
R.pipe(1, R.isDeepEqual(1)); //=> true
R.pipe(1, R.isDeepEqual("1")); //=> false
R.pipe([1, 2, 3], R.isDeepEqual([1, 2, 3])); //=> true
```

isDefined

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isDefined.ts "View source on Github")

A function that checks if the passed parameter is defined ( `!== undefined`)
and narrows its type accordingly.

```
R.isDefined(data);
```

Expand

```
R.isDefined("string"); //=> true
R.isDefined(null); //=> true
R.isDefined(undefined); //=> false
```

isEmpty

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isEmpty.ts "View source on Github")

A function that checks if the passed parameter is empty.

This function has _limited_ utility at the type level because **negating** it
does not yield a useful type in most cases because of TypeScript
limitations. Additionally, utilities which accept a narrower input type
provide better type-safety on their inputs. In most cases, you should use
one of the following functions instead:

- [`isEmptyish`](https://remedajs.com/docs/#isEmptyish) \- supports a wider range of cases, accepts any input including nullish values, and does a better job at narrowing the result.
- [`hasAtLeast`](https://remedajs.com/docs/#hasAtLeast) \- when the input is just an array/tuple.
- [`isStrictEqual`](https://remedajs.com/docs/#isStrictEqual) \- when you just need to check for a specific literal value.
- [`isNullish`](https://remedajs.com/docs/#isNullish) \- when you just care about `null` and `undefined`.
- [`isTruthy`](https://remedajs.com/docs/#isTruthy) \- when you need to also filter `number` and `boolean`.

```
R.isEmpty(data);
```

Expand

```
R.isEmpty(""); //=> true
R.isEmpty([]); //=> true
R.isEmpty({}); //=> true

R.isEmpty("test"); //=> false
R.isEmpty([1, 2, 3]); //=> false
R.isEmpty({ a: "hello" }); //=> false

R.isEmpty(undefined); // Deprecated: use `isEmptyish`
```

Expand

isEmptyish

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isEmptyish.ts "View source on Github")

A function that checks if the input is empty. Empty is defined as anything
exposing a numerical [`length`](https://remedajs.com/docs/#length), or `size` property that is equal to `0`. This
definition covers strings, arrays, Maps, Sets, plain objects, and custom
classes. Additionally, `null` and `undefined` are also considered empty.

`number`, `bigint`, `boolean`, `symbol`, and `function` will always return
`false`. `RegExp`, `Date`, and weak collections will always return `true`.
Classes and Errors are treated as plain objects: if they expose any public
property they would be considered non-empty, unless they expose a numerical
[`length`](https://remedajs.com/docs/#length) or `size` property, which defines their emptiness regardless of
other properties.

This function has _limited_ utility at the type level because **negating** it
does not yield a useful type in most cases because of TypeScript
limitations. Additionally, utilities which accept a narrower input type
provide better type-safety on their inputs. In most cases, you should use
one of the following functions instead:

- [`isEmpty`](https://remedajs.com/docs/#isEmpty) \- provides better type-safety on inputs by accepting a narrower set of cases.
- [`hasAtLeast`](https://remedajs.com/docs/#hasAtLeast) \- when the input is just an array/tuple.
- [`isStrictEqual`](https://remedajs.com/docs/#isStrictEqual) \- when you just need to check for a specific literal value.
- [`isNullish`](https://remedajs.com/docs/#isNullish) \- when you just care about `null` and `undefined`.
- [`isTruthy`](https://remedajs.com/docs/#isTruthy) \- when you need to also filter `number` and `boolean`.

```
R.isEmptyish(data);
```

Expand

```
R.isEmptyish(undefined); //=> true
R.isEmptyish(null); //=> true
R.isEmptyish(""); //=> true
R.isEmptyish([]); //=> true
R.isEmptyish({}); //=> true
R.isEmptyish(new Map()); //=> true
R.isEmptyish(new Set()); //=> true
R.isEmptyish({ a: "hello", size: 0 }); //=> true
R.isEmptyish(/abc/); //=> true
R.isEmptyish(new Date()); //=> true
R.isEmptyish(new WeakMap()); //=> true

R.isEmptyish("test"); //=> false
R.isEmptyish([1, 2, 3]); //=> false
R.isEmptyish({ a: "hello" }); //=> false
R.isEmptyish({ length: 1 }); //=> false
R.isEmptyish(0); //=> false
R.isEmptyish(true); //=> false
R.isEmptyish(() => {}); //=> false
```

isError

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isError.ts "View source on Github")

A function that checks if the passed parameter is an Error and narrows its type accordingly.

```
R.isError(data);
```

Expand

```
R.isError(new Error("message")); //=> true
R.isError("somethingElse"); //=> false
```

isFunction

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isFunction.ts "View source on Github")

A function that checks if the passed parameter is a Function and narrows its type accordingly.

```
R.isFunction(data);
```

Expand

```
R.isFunction(() => {}); //=> true
R.isFunction("somethingElse"); //=> false
```

isIncludedIn

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isIncludedIn.ts "View source on Github")

Checks if the item is included in the container. This is a wrapper around
`Array.prototype.includes` and `Set.prototype.has` and thus relies on the
same equality checks that those functions do (which is reference equality,
e.g. `===`). In some cases the input's type is also narrowed to the
container's item types.

Notice that unlike most functions, this function takes a generic item as it's
data and **an array** as it's parameter.

###### Data First

```
R.isIncludedIn(data, container);
```

Expand

```
R.isIncludedIn(2, [1, 2, 3]); // => true
R.isIncludedIn(4, [1, 2, 3]); // => false

const data = "cat" as "cat" | "dog" | "mouse";
R.isIncludedIn(data, ["cat", "dog"] as const); // true (typed "cat" | "dog");
```

###### Data Last

```
R.isIncludedIn(container)(data);
```

Expand

```
R.pipe(2, R.isIncludedIn([1, 2, 3])); // => true
R.pipe(4, R.isIncludedIn([1, 2, 3])); // => false

const data = "cat" as "cat" | "dog" | "mouse";
R.pipe(data, R.isIncludedIn(["cat", "dog"] as const)); // => true (typed "cat" | "dog");
```

isNonNull

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isNonNull.ts "View source on Github")

A function that checks if the passed parameter is not `null` and narrows its type accordingly.
Notice that `undefined` is not null!

```
R.isNonNull(data);
```

Expand

```
R.isNonNull("string"); //=> true
R.isNonNull(null); //=> false
R.isNonNull(undefined); //=> true
```

isNonNullish

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isNonNullish.ts "View source on Github")

A function that checks if the passed parameter is defined _AND_ isn't `null`
and narrows its type accordingly.

```
R.isNonNullish(data);
```

Expand

```
R.isNonNullish("string"); //=> true
R.isNonNullish(null); //=> false
R.isNonNullish(undefined); //=> false
```

isNot

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isNot.ts "View source on Github")

A function that takes a guard function as predicate and returns a guard that negates it.

###### Data Last

```
R.isNot(R.isTruthy)(data);
```

Expand

```
R.isNot(R.isTruthy)(false); //=> true
R.isNot(R.isTruthy)(true); //=> false
```

isNullish

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isNullish.ts "View source on Github")

A function that checks if the passed parameter is either `null` or
`undefined` and narrows its type accordingly.

```
R.isNullish(data);
```

Expand

```
R.isNullish(undefined); //=> true
R.isNullish(null); //=> true
R.isNullish("somethingElse"); //=> false
```

isNumber

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isNumber.ts "View source on Github")

A function that checks if the passed parameter is a number and narrows its
type accordingly.

```
R.isNumber(data);
```

Expand

```
R.isNumber(1); // => true
R.isNumber(1n); // => false
R.isNumber("notANumber"); // => false
```

isObjectType

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isObjectType.ts "View source on Github")

Checks if the given parameter is of type `"object"` via `typeof`, excluding `null`.

It's important to note that in JavaScript, many entities are considered objects, like Arrays, Classes, RegExps, Maps, Sets, Dates, URLs, Promise, Errors, and more. Although technically an object too, `null` is not considered an object by this function, so that its easier to narrow nullables.

For a more specific check that is limited to plain objects (simple struct/shape/record-like objects), consider using [`isPlainObject`](https://remedajs.com/docs/#isPlainObject) instead. For a simpler check that only removes `null` from the type prefer [`isNonNull`](https://remedajs.com/docs/#isNonNull) or [`isDefined`](https://remedajs.com/docs/#isDefined).

###### Data First

```
R.isObjectType(data);
```

Expand

```
// true
R.isObjectType({}); //=> true
R.isObjectType([]); //=> true
R.isObjectType(Promise.resolve("something")); //=> true
R.isObjectType(new Date()); //=> true
R.isObjectType(new Error("error")); //=> true

// false
R.isObjectType("somethingElse"); //=> false
R.isObjectType(null); //=> false
```

isPlainObject

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isPlainObject.ts "View source on Github")

Checks if `data` is a "plain" object. A plain object is defined as an object with string keys and values of any type, including primitives, other objects, functions, classes, etc (aka struct/shape/record/simple). Technically, a plain object is one whose prototype is either `Object.prototype` or `null`, ensuring it does not inherit properties or methods from other object types.

This function is narrower in scope than [`isObjectType`](https://remedajs.com/docs/#isObjectType), which accepts any entity considered an `"object"` by JavaScript's `typeof`.

Note that Maps, Arrays, and Sets are not considered plain objects and would return `false`.

```
R.isPlainObject(data);
```

Expand

```
// true
R.isPlainObject({}); //=> true
R.isPlainObject({ a: 123 }); //=> true

// false
R.isPlainObject([]); //=> false
R.isPlainObject(Promise.resolve("something")); //=> false
R.isPlainObject(new Date()); //=> false
R.isPlainObject(new Error("error")); //=> false
R.isPlainObject("somethingElse"); //=> false
R.isPlainObject(null); //=> false
```

isPromise

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isPromise.ts "View source on Github")

A function that checks if the passed parameter is a Promise and narrows its type accordingly.

```
R.isPromise(data);
```

Expand

```
R.isPromise(Promise.resolve(5)); //=> true
R.isPromise(Promise.reject(5)); //=> true
R.isPromise("somethingElse"); //=> false
```

isShallowEqual

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isShallowEqual.ts "View source on Github")

Performs a _shallow structural_ comparison between two values to determine if
they are equivalent. For primitive values this is equivalent to `===`, for
arrays a **strict equality** check would be performed on every item, in
order, and for objects props will be matched and checked for **strict**
**equality**; Unlike [`isDeepEqual`](https://remedajs.com/docs/#isDeepEqual) where the function also _recurses_ into each
item and value.

!IMPORTANT: symbol properties of objects are not supported right now and
might result in unexpected behavior. Please open an issue in the Remeda
github project if you need support for these types.

!IMPORTANT: Promise, Date, and RegExp, are shallowly equal, even when they
are semantically different (e.g. resolved promises); but [`isDeepEqual`](https://remedajs.com/docs/#isDeepEqual) does
compare the latter 2 semantically by-value.

The result would be narrowed to the second value so that the function can be
used as a type guard.

See:

- [`isStrictEqual`](https://remedajs.com/docs/#isStrictEqual) if you don't need a deep comparison and just want to check
for simple ( `===`, `Object.is`) equality.
- [`isDeepEqual`](https://remedajs.com/docs/#isDeepEqual) for a recursively deep check of arrays and objects.

###### Data First

```
R.isShallowEqual(data, other);
```

Expand

```
R.isShallowEqual(1, 1); //=> true
R.isShallowEqual(1, "1"); //=> false
R.isShallowEqual([1, 2, 3], [1, 2, 3]); //=> true
R.isShallowEqual([[1], [2], [3]], [[1], [2], [3]]); //=> false
```

###### Data First

```
R.isShallowEqual(other)(data);
```

Expand

```
R.pipe(1, R.isShallowEqual(1)); //=> true
R.pipe(1, R.isShallowEqual("1")); //=> false
R.pipe([1, 2, 3], R.isShallowEqual([1, 2, 3])); //=> true
R.pipe([[1], [2], [3]], R.isShallowEqual([[1], [2], [3]])); //=> false
```

isStrictEqual

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isStrictEqual.ts "View source on Github")

Determines whether two values are _functionally identical_ in all contexts.
For primitive values (string, number), this is done by-value, and for objects
it is done by-reference (i.e., they point to the same object in memory).

Under the hood we use **both** the [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). This means that `isStrictEqual(NaN, NaN) === true`
(whereas `NaN !== NaN`), and `isStrictEqual(-0, 0) === true` (whereas
`Object.is(-0, 0) === false`).

The result would be narrowed to the second value so that the function can be
used as a type guard.

See:

- [`isDeepEqual`](https://remedajs.com/docs/#isDeepEqual) for a semantic comparison that allows comparing arrays and
objects "by-value", and recurses for every item.
- [`isShallowEqual`](https://remedajs.com/docs/#isShallowEqual) if you need to compare arrays and objects "by-value" but
don't want to recurse into their values.

###### Data First

```
R.isStrictEqual(data, other);
```

Expand

```
R.isStrictEqual(1, 1); //=> true
R.isStrictEqual(1, "1"); //=> false
R.isStrictEqual([1, 2, 3], [1, 2, 3]); //=> false
```

###### Data Last

```
R.isStrictEqual(other)(data);
```

Expand

```
R.pipe(1, R.isStrictEqual(1)); //=> true
R.pipe(1, R.isStrictEqual("1")); //=> false
R.pipe([1, 2, 3], R.isStrictEqual([1, 2, 3])); //=> false
```

isString

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isString.ts "View source on Github")

A function that checks if the passed parameter is a string and narrows its type accordingly.

```
R.isString(data);
```

Expand

```
R.isString("string"); //=> true
R.isString(1); //=> false
```

isSymbol

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isSymbol.ts "View source on Github")

A function that checks if the passed parameter is a symbol and narrows its type accordingly.

```
R.isSymbol(data);
```

Expand

```
R.isSymbol(Symbol("foo")); //=> true
R.isSymbol(1); //=> false
```

isTruthy

Guard [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/isTruthy.ts "View source on Github")

A function that checks if the passed parameter is truthy and narrows its type accordingly.

```
R.isTruthy(data);
```

Expand

```
R.isTruthy("somethingElse"); //=> true
R.isTruthy(null); //=> false
R.isTruthy(undefined); //=> false
R.isTruthy(false); //=> false
R.isTruthy(0); //=> false
R.isTruthy(""); //=> false
```

## number

add

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/add.ts "View source on Github")

Adds two numbers.

###### Data First

```
R.add(value, addend);
```

Expand

```
R.add(10, 5); // => 15
R.add(10, -5); // => 5
```

###### Data Last

```
R.add(addend)(value);
```

Expand

```
R.add(5)(10); // => 15
R.add(-5)(10); // => 5
R.map([1, 2, 3, 4], R.add(1)); // => [2, 3, 4, 5]
```

ceil

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/ceil.ts "View source on Github")

Rounds up a given number to a specific precision.
If you'd like to round up to an integer (i.e. use this function with constant `precision === 0`),
use `Math.ceil` instead, as it won't incur the additional library overhead.

###### Data First

```
R.ceil(value, precision);
```

Expand

```
R.ceil(123.9876, 3); // => 123.988
R.ceil(483.22243, 1); // => 483.3
R.ceil(8541, -1); // => 8550
R.ceil(456789, -3); // => 457000
```

###### Data Last

```
R.ceil(precision)(value);
```

Expand

```
R.ceil(3)(123.9876); // => 123.988
R.ceil(1)(483.22243); // => 483.3
R.ceil(-1)(8541); // => 8550
R.ceil(-3)(456789); // => 457000
```

clamp

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/clamp.ts "View source on Github")

Clamp the given value within the inclusive min and max bounds.

###### Data First

```
R.clamp(value, { min, max });
```

Expand

```
clamp(10, { min: 20 }); // => 20
clamp(10, { max: 5 }); // => 5
clamp(10, { max: 20, min: 5 }); // => 10
```

###### Data Last

```
R.clamp({ min, max })(value);
```

Expand

```
clamp({ min: 20 })(10); // => 20
clamp({ max: 5 })(10); // => 5
clamp({ max: 20, min: 5 })(10); // => 10
```

divide

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/divide.ts "View source on Github")

Divides two numbers.

###### Data First

```
R.divide(value, divisor);
```

Expand

```
R.divide(12, 3); // => 4
R.reduce([1, 2, 3, 4], R.divide, 24); // => 1
```

###### Data Last

```
R.divide(divisor)(value);
```

Expand

```
R.divide(3)(12); // => 4
R.map([2, 4, 6, 8], R.divide(2)); // => [1, 2, 3, 4]
```

floor

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/floor.ts "View source on Github")

Rounds down a given number to a specific precision.
If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
use `Math.floor` instead, as it won't incur the additional library overhead.

###### Data First

```
R.floor(value, precision);
```

Expand

```
R.floor(123.9876, 3); // => 123.987
R.floor(483.22243, 1); // => 483.2
R.floor(8541, -1); // => 8540
R.floor(456789, -3); // => 456000
```

###### Data Last

```
R.floor(precision)(value);
```

Expand

```
R.floor(3)(123.9876); // => 123.987
R.floor(1)(483.22243); // => 483.2
R.floor(-1)(8541); // => 8540
R.floor(-3)(456789); // => 456000
```

mean

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/mean.ts "View source on Github")

Returns the mean of the elements of an array.

Only `number` arrays are supported, as `bigint` is unable to represent fractional values.

IMPORTANT: The result for empty arrays would be `undefined`, regardless of
the type of the array. This approach improves type-checking and ensures that
cases where `NaN` might occur are handled properly. To avoid adding this to
the return type for cases where the array is known to be non-empty you can use
[`hasAtLeast`](https://remedajs.com/docs/#hasAtLeast) or [`isEmpty`](https://remedajs.com/docs/#isEmpty) to guard against this case.

###### Data First

```
R.mean(data);
```

Expand

```
R.mean([1, 2, 3]); // => 2
R.mean([]); // => undefined
```

###### Data Last

```
R.mean()(data);
```

Expand

```
R.pipe([1, 2, 3], R.mean()); // => 2
R.pipe([], R.mean()); // => undefined
```

median

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/median.ts "View source on Github")

Returns the median of the elements of an array.

Only `number` arrays are supported, as `bigint` is unable to represent fractional values.

IMPORTANT: The result for empty arrays would be `undefined`, regardless of
the type of the array. This approach improves type-checking and ensures that
cases where `NaN` might occur are handled properly. To avoid adding this to
the return type for cases where the array is known to be non-empty you can use
[`hasAtLeast`](https://remedajs.com/docs/#hasAtLeast) or [`isEmpty`](https://remedajs.com/docs/#isEmpty) to guard against this case.

###### Data First

```
R.median(data);
```

Expand

```
R.pipe([6, 10, 11], R.median()); // => 10
R.median([]); // => undefined
```

###### Data Last

```
R.median()(data);
```

Expand

```
R.pipe([6, 10, 11], R.median()); // => 10
R.pipe([], R.median()); // => undefined
```

multiply

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/multiply.ts "View source on Github")

Multiplies two numbers.

###### Data First

```
R.multiply(value, multiplicand);
```

Expand

```
R.multiply(3, 4); // => 12
R.reduce([1, 2, 3, 4], R.multiply, 1); // => 24
```

###### Data Last

```
R.multiply(multiplicand)(value);
```

Expand

```
R.multiply(4)(3); // => 12
R.map([1, 2, 3, 4], R.multiply(2)); // => [2, 4, 6, 8]
```

product

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/product.ts "View source on Github")

Compute the product of the numbers in the array, or return 1 for an empty
array.

Works for both `number` and `bigint` arrays, but not arrays that contain both
types.

IMPORTANT: The result for empty arrays would be 1 ( `number`) regardless of
the type of the array; to avoid adding this to the return type for cases
where the array is known to be non-empty you can use [`hasAtLeast`](https://remedajs.com/docs/#hasAtLeast) or
[`isEmpty`](https://remedajs.com/docs/#isEmpty) to guard against this case.

###### Data First

```
R.product(data);
```

Expand

```
R.product([1, 2, 3]); // => 6
R.product([1n, 2n, 3n]); // => 6n
R.product([]); // => 1
```

###### Data Last

```
R.product()(data);
```

Expand

```
R.pipe([1, 2, 3], R.product()); // => 6
R.pipe([1n, 2n, 3n], R.product()); // => 6n
R.pipe([], R.product()); // => 1
```

randomBigInt

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/randomBigInt.ts "View source on Github")

Generate a random `bigint` between `from` and `to` (inclusive).

! Important: In most environments this function uses
[`crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
under-the-hood which **is** cryptographically strong. When the WebCrypto API
isn't available (Node 18) we fallback to an implementation that uses
[`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
which is **NOT** cryptographically secure.

###### Data First

```
R.randomBigInt(from, to);
```

Expand

```
R.randomBigInt(1n, 10n); // => 5n
```

randomInteger

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/randomInteger.ts "View source on Github")

Generate a random integer between `from` and `to` (inclusive).

!Important: This function uses [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) under-the-hood, which has two major limitations:

1. It generates 2^52 possible values, so the bigger the range, the less
uniform the distribution of values would be, and at ranges larger than that
some values would never come up.
2. It is not cryptographically secure and should not be used for security
scenarios.

###### Data First

```
R.randomInteger(from, to);
```

Expand

```
R.randomInteger(1, 10); // => 5
R.randomInteger(1.5, 2.6); // => 2
```

round

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/round.ts "View source on Github")

Rounds a given number to a specific precision.
If you'd like to round to an integer (i.e. use this function with constant `precision === 0`),
use `Math.round` instead, as it won't incur the additional library overhead.

###### Data First

```
R.round(value, precision);
```

Expand

```
R.round(123.9876, 3); // => 123.988
R.round(483.22243, 1); // => 483.2
R.round(8541, -1); // => 8540
R.round(456789, -3); // => 457000
```

###### Data Last

```
R.round(precision)(value);
```

Expand

```
R.round(3)(123.9876); // => 123.988
R.round(1)(483.22243); // => 483.2
R.round(-1)(8541); // => 8540
R.round(-3)(456789); // => 457000
```

subtract

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/subtract.ts "View source on Github")

Subtracts two numbers.

###### Data First

```
R.subtract(value, subtrahend);
```

Expand

```
R.subtract(10, 5); // => 5
R.subtract(10, -5); // => 15
R.reduce([1, 2, 3, 4], R.subtract, 20); // => 10
```

###### Data Last

```
R.subtract(subtrahend)(value);
```

Expand

```
R.subtract(5)(10); // => 5
R.subtract(-5)(10); // => 15
R.map([1, 2, 3, 4], R.subtract(1)); // => [0, 1, 2, 3]
```

sum

Number [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sum.ts "View source on Github")

Sums the numbers in the array, or return 0 for an empty array.

Works for both `number` and `bigint` arrays, but not arrays that contain both
types.

IMPORTANT: The result for empty arrays would be 0 ( `number`) regardless of
the type of the array; to avoid adding this to the return type for cases
where the array is known to be non-empty you can use [`hasAtLeast`](https://remedajs.com/docs/#hasAtLeast) or
[`isEmpty`](https://remedajs.com/docs/#isEmpty) to guard against this case.

###### Data First

```
R.sum(data);
```

Expand

```
R.sum([1, 2, 3]); // => 6
R.sum([1n, 2n, 3n]); // => 6n
R.sum([]); // => 0
```

###### Data Last

```
R.sum()(data);
```

Expand

```
R.pipe([1, 2, 3], R.sum()); // => 6
R.pipe([1n, 2n, 3n], R.sum()); // => 6n
R.pipe([], R.sum()); // => 0
```

## object

addProp

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/addProp.ts "View source on Github")

Add a new property to an object.

The function doesn't do any checks on the input object. If the property
already exists it will be overwritten, and the type of the new value is not
checked against the previous type.

Use [`set`](https://remedajs.com/docs/#set) to override values explicitly with better protections.

###### Data First

```
R.addProp(obj, prop, value);
```

Expand

```
R.addProp({ firstName: "john" }, "lastName", "doe"); // => {firstName: 'john', lastName: 'doe'}
```

###### Data Last

```
R.addProp(prop, value)(obj);
```

Expand

```
R.addProp("lastName", "doe")({ firstName: "john" }); // => {firstName: 'john', lastName: 'doe'}
```

clone

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/clone.ts "View source on Github")

Creates a deep copy of the value. Supported types: [plain objects](https://remedajs.com/docs/#isPlainObject),
`Array`, `number`, `string`, `boolean`, `Date`, and `RegExp`. Functions are
assigned by reference rather than copied. Class instances or any other
built-in type that isn't mentioned above are not supported (but might
work).

###### Data First

```
R.clone(data);
```

Expand

```
R.clone({ foo: "bar" }); // {foo: 'bar'}
```

###### Data Last

```
R.clone()(data);
```

Expand

```
R.pipe({ foo: "bar" }, R.clone()); // {foo: 'bar'}
```

entries

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/entries.ts "View source on Github")

Returns an array of key/values of the enumerable properties of an object.

###### Data First

```
R.entries(object);
```

Expand

```
R.entries({ a: 1, b: 2, c: 3 }); // => [['a', 1], ['b', 2], ['c', 3]]
```

###### Data Last

```
R.entries()(object);
```

Expand

```
R.pipe({ a: 1, b: 2, c: 3 }, R.entries()); // => [['a', 1], ['b', 2], ['c', 3]]
```

evolve

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/evolve.ts "View source on Github")

Creates a new object by applying functions that is included in `evolver` object parameter
to the `data` object parameter according to their corresponding path.

Functions included in `evolver` object will not be invoked
if its corresponding key does not exist in the `data` object.
Also, values included in `data` object will be kept as is
if its corresponding key does not exist in the `evolver` object.

###### Data First

```
R.evolve(data, evolver);
```

Expand

```
const evolver = {
  count: add(1),
  time: { elapsed: add(1), remaining: add(-1) },
};
const data = {
  id: 10,
  count: 10,
  time: { elapsed: 100, remaining: 1400 },
};
evolve(data, evolver);
// => {
//   id: 10,
//   count: 11,
//   time: { elapsed: 101, remaining: 1399 },
// }
```

###### Data Last

```
R.evolve(evolver)(data);
```

Expand

```
const evolver = {
  count: add(1),
  time: { elapsed: add(1), remaining: add(-1) },
};
const data = {
  id: 10,
  count: 10,
  time: { elapsed: 100, remaining: 1400 },
};
R.pipe(data, R.evolve(evolver));
// => {
//   id: 10,
//   count: 11,
//   time: { elapsed: 101, remaining: 1399 },
// }
```

forEachObj

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/forEachObj.ts "View source on Github")

Iterate an object using a defined callback function.

The dataLast version returns the original object (instead of not returning
anything ( `void`)) to allow using it in a pipe. The returned object is the
same reference as the input object, and not a shallow copy of it!

###### Data First

```
R.forEachObj(object, fn);
```

Expand

```
R.forEachObj({ a: 1 }, (val, key, obj) => {
  console.log(`${key}: ${val}`);
}); // "a: 1"
```

###### Data Last

```
R.forEachObj(fn)(object);
```

Expand

```
R.pipe(
  { a: 1 },
  R.forEachObj((val, key) => console.log(`${key}: ${val}`)),
); // "a: 1"
```

fromEntries

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/fromEntries.ts "View source on Github")

Creates a new object from an array of tuples by pairing up first and second elements as {\[key\]: value}.
If a tuple is not supplied for any element in the array, the element will be ignored
If duplicate keys exist, the tuple with the greatest index in the input array will be preferred.

The strict option supports more sophisticated use-cases like those that would
result when calling the strict `toPairs` function.

There are several other functions that could be used to build an object from
an array:

- [`fromKeys`](https://remedajs.com/docs/#fromKeys) \- Builds an object from an array of _keys_ and a mapper for values.
- [`indexBy`](https://remedajs.com/docs/#indexBy) \- Builds an object from an array of _values_ and a mapper for keys.
- [`pullObject`](https://remedajs.com/docs/#pullObject) \- Builds an object from an array of items with mappers for _both_ keys and values.
Refer to the docs for more details.

###### Data First

```
R.fromEntries(tuples);
```

Expand

```
R.fromEntries([\
  ["a", "b"],\
  ["c", "d"],\
]); // => {a: 'b', c: 'd'}
```

###### Data Last

```
R.fromEntries()(tuples);
```

Expand

```
R.pipe(
  [\
    ["a", "b"],\
    ["c", "d"],\
  ] as const,
  R.fromEntries(),
); // => {a: 'b', c: 'd'}
```

fromKeys

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/fromKeys.ts "View source on Github")

Creates an object that maps each key in `data` to the result of `mapper` for
that key. Duplicate keys are overwritten, guaranteeing that `mapper` is run
for each item in `data`.

There are several other functions that could be used to build an object from
an array:

- [`indexBy`](https://remedajs.com/docs/#indexBy) \- Builds an object from an array of _values_ and a mapper for keys.
- [`pullObject`](https://remedajs.com/docs/#pullObject) \- Builds an object from an array of items with mappers for _both_ keys and values.
- [`fromEntries`](https://remedajs.com/docs/#fromEntries) \- Builds an object from an array of key-value pairs.
Refer to the docs for more details.

###### Data First

```
R.fromKeys(data, mapper);
```

Expand

```
R.fromKeys(["cat", "dog"], R.length()); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
R.fromKeys([1, 2], R.add(1)); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
```

###### Data Last

```
R.fromKeys(mapper)(data);
```

Expand

```
R.pipe(["cat", "dog"], R.fromKeys(R.length())); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
R.pipe([1, 2], R.fromKeys(R.add(1))); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
```

invert

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/invert.ts "View source on Github")

Returns an object whose keys and values are swapped. If the object contains duplicate values,
subsequent values will overwrite previous values.

###### Data First

```
R.invert(object);
```

Expand

```
R.invert({ a: "d", b: "e", c: "f" }); // => { d: "a", e: "b", f: "c" }
```

###### Data Last

```
R.invert()(object);
```

Expand

```
R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
```

keys

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/keys.ts "View source on Github")

Returns a new array containing the keys of the array or object.

###### Data First

```
R.keys(source);
```

Expand

```
R.keys(["x", "y", "z"]); // => ['0', '1', '2']
R.keys({ a: "x", b: "y", 5: "z" }); // => ['a', 'b', '5']
```

###### Data Last

```
R.keys()(source);
```

Expand

```
R.Pipe(["x", "y", "z"], keys()); // => ['0', '1', '2']
R.pipe({ a: "x", b: "y", 5: "z" } as const, R.keys()); // => ['a', 'b', '5']
```

mapKeys

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/mapKeys.ts "View source on Github")

Maps keys of `object` and keeps the same values.

###### Data First

```
R.mapKeys(object, fn);
```

Expand

```
R.mapKeys({ a: 1, b: 2 }, (key, value) => key + value); // => { a1: 1, b2: 2 }
```

###### Data Last

```
R.mapKeys(fn)(object);
```

Expand

```
R.pipe(
  { a: 1, b: 2 },
  R.mapKeys((key, value) => key + value),
); // => { a1: 1, b2: 2 }
```

mapValues

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/mapValues.ts "View source on Github")

Maps values of `object` and keeps the same keys. Symbol keys are not passed
to the mapper and will be removed from the output object.

To also copy the symbol keys to the output use merge:
`merge(data, mapValues(data, mapper))`).

###### Data First

```
R.mapValues(data, mapper);
```

Expand

```
R.mapValues({ a: 1, b: 2 }, (value, key) => value + key); // => {a: '1a', b: '2b'}
```

###### Data Last

```
R.mapValues(mapper)(data);
```

Expand

```
R.pipe(
  { a: 1, b: 2 },
  R.mapValues((value, key) => value + key),
); // => {a: '1a', b: '2b'}
```

merge

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/merge.ts "View source on Github")

Merges two objects into one by combining their properties, effectively
creating a new object that incorporates elements from both. The merge
operation prioritizes the second object's properties, allowing them to
overwrite those from the first object with the same names.

Equivalent to `{ ...data, ...source }`.

###### Data First

```
R.merge(data, source);
```

Expand

```
R.merge({ x: 1, y: 2 }, { y: 10, z: 2 }); // => { x: 1, y: 10, z: 2 }
```

###### Data Last

```
R.merge(source)(data);
```

Expand

```
R.pipe({ x: 1, y: 2 }, R.merge({ y: 10, z: 2 })); // => { x: 1, y: 10, z: 2 }
```

mergeDeep

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/mergeDeep.ts "View source on Github")

Merges the `source` object into the `destination` object. The merge is similar to performing `{ ...destination, ... source }` (where disjoint values from each object would be copied as-is, and for any overlapping props the value from `source` would be used); But for _each prop_ ( `p`), if **both** `destination` and `source` have a **plain-object** as a value, the value would be taken as the result of recursively deepMerging them ( `result.p === deepMerge(destination.p, source.p)`).

###### Data First

```
R.mergeDeep(destination, source);
```

Expand

```
R.mergeDeep({ foo: "bar", x: 1 }, { foo: "baz", y: 2 }); // => { foo: 'baz', x: 1, y: 2 }
```

###### Data Last

```
R.mergeDeep(source)(destination);
```

Expand

```
R.pipe({ foo: "bar", x: 1 }, R.mergeDeep({ foo: "baz", y: 2 })); // => { foo: 'baz', x: 1, y: 2 }
```

objOf

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/objOf.ts "View source on Github")

Creates an object containing a single `key:value` pair.

```
R.objOf(value, key);
```

Expand

```
R.objOf(10, "a"); // => { a: 10 }
```

```
R.objOf(key)(value);
```

Expand

```
R.pipe(10, R.objOf("a")); // => { a: 10 }
```

omit

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/omit.ts "View source on Github")

Returns a partial copy of an object omitting the keys specified.

###### Data First

```
R.omit(obj, names);
```

Expand

```
R.omit({ a: 1, b: 2, c: 3, d: 4 }, ["a", "d"]); // => { b: 2, c: 3 }
```

###### Data Last

```
R.omit(names)(obj);
```

Expand

```
R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(["a", "d"])); // => { b: 2, c: 3 }
```

omitBy

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/omitBy.ts "View source on Github")

Creates a shallow copy of the data, and then removes any keys that the
predicate rejects. Symbol keys are not passed to the predicate and would be
passed through to the output as-is.

See [`pickBy`](https://remedajs.com/docs/#pickBy) for a complementary function which starts with an empty object
and adds the entries that the predicate accepts. Because it is additive,
symbol keys will not be passed through to the output object.

###### Data First

```
R.omitBy(data, predicate);
```

Expand

```
R.omitBy({ a: 1, b: 2, A: 3, B: 4 }, (val, key) => key.toUpperCase() === key); // => {a: 1, b: 2}
```

###### Data Last

```
R.omitBy(fn)(object);
```

Expand

```
R.omitBy((val, key) => key.toUpperCase() === key)({ a: 1, b: 2, A: 3, B: 4 }); // => {a: 1, b: 2}
```

pathOr

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/pathOr.ts "View source on Github")

Gets the value at `path` of `object`. If the resolved value is `null` or `undefined`, the `defaultValue` is returned in its place.

**DEPRECATED**: Use `defaultTo(prop(object, ...path), defaultValue)`
instead!

###### Data First

```
R.pathOr(object, array, defaultValue);
```

Expand

```
R.pathOr({ x: 10 }, ["y"], 2); // 2
R.pathOr({ y: 10 }, ["y"], 2); // 10
```

Expand

###### Data Last

```
R.pathOr(array, defaultValue)(object);
```

Expand

```
R.pipe({ x: 10 }, R.pathOr(["y"], 2)); // 2
R.pipe({ y: 10 }, R.pathOr(["y"], 2)); // 10
```

pick

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/pick.ts "View source on Github")

Creates an object composed of the picked `data` properties.

###### Data First

```
R.pick(object, [prop1, prop2]);
```

Expand

```
R.pick({ a: 1, b: 2, c: 3, d: 4 }, ["a", "d"]); // => { a: 1, d: 4 }
```

###### Data Last

```
R.pick([prop1, prop2])(object);
```

Expand

```
R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(["a", "d"])); // => { a: 1, d: 4 }
```

pickBy

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/pickBy.ts "View source on Github")

Iterates over the entries of `data` and reconstructs the object using only
entries that `predicate` accepts. Symbol keys are not passed to the predicate
and would be filtered out from the output object.

See [`omitBy`](https://remedajs.com/docs/#omitBy) for a complementary function which starts with a shallow copy of
the input object and removes the entries that the predicate rejects. Because
it is subtractive symbol keys would be copied over to the output object.
See also [`entries`](https://remedajs.com/docs/#entries), [`filter`](https://remedajs.com/docs/#filter), and [`fromEntries`](https://remedajs.com/docs/#fromEntries) which could be used to build
your own version of [`pickBy`](https://remedajs.com/docs/#pickBy) if you need more control (though the resulting
type might be less precise).

###### Data First

```
R.pickBy(data, predicate);
```

Expand

```
R.pickBy({ a: 1, b: 2, A: 3, B: 4 }, (val, key) => key.toUpperCase() === key); // => {A: 3, B: 4}
```

###### Data Last

```
R.pickBy(predicate)(data);
```

Expand

```
R.pipe(
  { a: 1, b: 2, A: 3, B: 4 },
  pickBy((val, key) => key.toUpperCase() === key),
); // => {A: 3, B: 4}
```

prop

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/prop.ts "View source on Github")

Gets the value of the given property from an object. Nested properties can
be accessed by providing a variadic array of keys that define the path from
the root to the desired property. Arrays can be accessed by using numeric
keys. Unions and optional properties are handled gracefully by returning
`undefined` early for any non-existing property on the path. Paths are
validated against the object type to provide stronger type safety, better
compile-time errors, and to enable autocompletion in IDEs.

###### Data First

```
R.prop(data, ...keys);
```

Expand

```
R.prop({ foo: { bar: "baz" } }, "foo"); //=> { bar: 'baz' }
R.prop({ foo: { bar: "baz" } }, "foo", "bar"); //=> 'baz'
R.prop(["cat", "dog"], 1); //=> 'dog'
```

###### Data Last

```
R.prop(...keys)(data);
```

Expand

```
R.pipe({ foo: { bar: "baz" } }, R.prop("foo")); //=> { bar: 'baz' }
R.pipe({ foo: { bar: "baz" } }, R.prop("foo", "bar")); //=> 'baz'
R.pipe(["cat", "dog"], R.prop(1)); //=> 'dog'
```

pullObject

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/pullObject.ts "View source on Github")

Creates an object that maps the result of `valueExtractor` with a key
resulting from running `keyExtractor` on each item in `data`. Duplicate keys
are overwritten, guaranteeing that the extractor functions are run on each
item in `data`.

There are several other functions that could be used to build an object from
an array:

- [`fromKeys`](https://remedajs.com/docs/#fromKeys) \- Builds an object from an array of _keys_ and a mapper for values.
- [`indexBy`](https://remedajs.com/docs/#indexBy) \- Builds an object from an array of _values_ and a mapper for keys.
- [`fromEntries`](https://remedajs.com/docs/#fromEntries) \- Builds an object from an array of key-value pairs.
Refer to the docs for more details.

###### Data First

```
R.pullObject(data, keyExtractor, valueExtractor);
```

Expand

```
R.pullObject(
  [\
    { name: "john", email: "john@remedajs.com" },\
    { name: "jane", email: "jane@remedajs.com" },\
  ],
  R.prop("name"),
  R.prop("email"),
); // => { john: "john@remedajs.com", jane: "jane@remedajs.com" }
```

###### Data Last

```
R.pullObject(keyExtractor, valueExtractor)(data);
```

Expand

```
R.pipe(
  [\
    { name: "john", email: "john@remedajs.com" },\
    { name: "jane", email: "jane@remedajs.com" },\
  ],
  R.pullObject(R.prop("email"), R.prop("name")),
); // => { john: "john@remedajs.com", jane: "jane@remedajs.com" }
```

set

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/set.ts "View source on Github")

Sets the `value` at [`prop`](https://remedajs.com/docs/#prop) of `object`.

To add a new property to an object, or to override its type, use [`addProp`](https://remedajs.com/docs/#addProp)
instead, and to set a property within a nested object use [`setPath`](https://remedajs.com/docs/#setPath).

###### Data First

```
R.set(obj, prop, value);
```

Expand

```
R.set({ a: 1 }, "a", 2); // => { a: 2 }
```

###### Data Last

```
R.set(prop, value)(obj);
```

Expand

```
R.pipe({ a: 1 }, R.set("a", 2)); // => { a: 2 }
```

setPath

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/setPath.ts "View source on Github")

Sets the value at `path` of `object`.

For simple cases where the path is only one level deep, prefer [`set`](https://remedajs.com/docs/#set) instead.

###### Data First

```
R.setPath(obj, path, value);
```

Expand

```
R.setPath({ a: { b: 1 } }, ["a", "b"], 2); // => { a: { b: 2 } }
```

###### Data Last

```
R.setPath(path, value)(obj);
```

Expand

```
R.pipe({ a: { b: 1 } }, R.setPath(["a", "b"], 2)); // { a: { b: 2 } }
```

swapProps

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/swapProps.ts "View source on Github")

Swaps the values of two properties in an object based on the provided keys.

###### Data First

```
swapProps(data, key1, key2);
```

Expand

```
swapProps({ a: 1, b: 2, c: 3 }, "a", "b"); // => {a: 2, b: 1, c: 3}
```

###### Data Last

```
swapProps(key1, key2)(data);
```

Expand

```
swapProps("a", "b")({ a: 1, b: 2, c: 3 }); // => {a: 2, b: 1, c: 3}
```

values

Object [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/values.ts "View source on Github")

Returns a new array containing the values of the array or object.

###### Data First

```
R.values(source);
```

Expand

```
R.values(["x", "y", "z"]); // => ['x', 'y', 'z']
R.values({ a: "x", b: "y", c: "z" }); // => ['x', 'y', 'z']
```

###### Data Last

```
R.values()(source);
```

Expand

```
R.pipe(["x", "y", "z"], R.values()); // => ['x', 'y', 'z']
R.pipe({ a: "x", b: "y", c: "z" }, R.values()); // => ['x', 'y', 'z']
R.pipe({ a: "x", b: "y", c: "z" }, R.values(), R.first()); // => 'x'
```

## other

defaultTo

Other [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/defaultTo.ts "View source on Github")

A stricter wrapper around the [Nullish coalescing operator `??`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
that ensures that the fallback matches the type of the data. Only works
when data can be `null` or `undefined`.

Notice that `Number.NaN` is not nullish and would not result in returning the
fallback!

###### Data First

```
R.defaultTo(data, fallback);
```

Expand

```
R.defaultTo("hello" as string | undefined, "world"); //=> "hello"
R.defaultTo(undefined as string | undefined, "world"); //=> "world"
```

###### Data Last

```
R.defaultTo(fallback)(data);
```

Expand

```
R.pipe("hello" as string | undefined, R.defaultTo("world")); //=> "hello"
R.pipe(undefined as string | undefined, R.defaultTo("world")); //=> "world"
```

tap

Other [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/tap.ts "View source on Github")

Calls the given function with the given value, then returns the given value.
The return value of the provided function is ignored.

This allows "tapping into" a function sequence in a pipe, to perform side
effects on intermediate results.

###### Data First

```
R.tap(value, fn);
```

Expand

```
R.tap("foo", console.log); // => "foo"
```

###### Data Last

```
R.tap(fn)(value);
```

Expand

```
R.pipe(
  [-5, -1, 2, 3],
  R.filter((n) => n > 0),
  R.tap(console.log), // prints [2, 3]
  R.map((n) => n * 2),
); // => [4, 6]
```

## string

capitalize

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/capitalize.ts "View source on Github")

Makes the first character of a string uppercase while leaving the rest
unchanged.

It uses the built-in [`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
for the runtime and the built-in [`Capitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype)
utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.

For display purposes, prefer using the CSS pseudo-element [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter) to target
just the first letter of the word, and [`text-transform: uppercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#uppercase)
to capitalize it. This transformation **is** locale-aware.

For other case manipulations see: [`toUpperCase`](https://remedajs.com/docs/#toUpperCase), [`toLowerCase`](https://remedajs.com/docs/#toLowerCase),
[`uncapitalize`](https://remedajs.com/docs/#uncapitalize), [`toCamelCase`](https://remedajs.com/docs/#toCamelCase), [`toKebabCase`](https://remedajs.com/docs/#toKebabCase), [`toSnakeCase`](https://remedajs.com/docs/#toSnakeCase), and
[`toTitleCase`](https://remedajs.com/docs/#toTitleCase).

###### Data First

```
R.capitalize(data);
```

Expand

```
R.capitalize("hello world"); // "Hello world"
```

###### Data Last

```
R.capitalize()(data);
```

Expand

```
R.pipe("hello world", R.capitalize()); // "Hello world"
```

endsWith

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/endsWith.ts "View source on Github")

Determines whether a string ends with the provided suffix, and refines the
output type if possible.

This function is a wrapper around the built-in [`String.prototype.endsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)
method, but doesn't expose the `endPosition` parameter. To check only up to a
specific position, use `endsWith(sliceString(data, 0, endPosition), suffix)`.

###### Data First

```
R.endsWith(data, suffix);
```

Expand

```
R.endsWith("hello world", "hello"); // false
R.endsWith("hello world", "world"); // true
```

###### Data Last

```
R.endsWith(suffix)(data);
```

Expand

```
R.pipe("hello world", R.endsWith("hello")); // false
R.pipe("hello world", R.endsWith("world")); // true
```

randomString

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/randomString.ts "View source on Github")

A [pseudo-random](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) [alpha-numeric](https://en.wikipedia.org/wiki/Alphanumericals) [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).

It is not [cryptographically secure](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator)!

###### Data First

```
R.randomString(length);
```

Expand

```
R.randomString(5); // => aB92J
```

###### Data Last

```
R.randomString()(length);
```

Expand

```
R.pipe(5, R.randomString()); // => aB92J
```

sliceString

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/sliceString.ts "View source on Github")

Extracts a section of a string between two indices.

This function is a wrapper around the built-in [`String.prototype.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice)
method.

###### Data First

```
R.sliceString(data, indexStart, indexEnd);
```

Expand

```
R.sliceString("abcdefghijkl", 1); // => `bcdefghijkl`
R.sliceString("abcdefghijkl", 4, 7); // => `efg`
```

###### Data Last

```
R.sliceString(indexStart, indexEnd)(string);
```

Expand

```
R.sliceString(1)("abcdefghijkl"); // => `bcdefghijkl`
R.sliceString(4, 7)("abcdefghijkl"); // => `efg`
```

split

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/split.ts "View source on Github")

Splits a string into an array of substrings using a separator pattern.

This function is a wrapper around the built-in [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
method.

###### Data First

```
R.split(data, separator, limit);
```

Expand

```
R.split("a,b,c", ","); //=> ["a", "b", "c"]
R.split("a,b,c", ",", 2); //=> ["a", "b"]
R.split("a1b2c3d", /\d/u); //=> ["a", "b", "c", "d"]
```

###### Data Last

```
R.split(separator, limit)(data);
```

Expand

```
R.pipe("a,b,c", R.split(",")); //=> ["a", "b", "c"]
R.pipe("a,b,c", R.split(",", 2)); //=> ["a", "b"]
R.pipe("a1b2c3d", R.split(/\d/u)); //=> ["a", "b", "c", "d"]
```

startsWith

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/startsWith.ts "View source on Github")

Determines whether a string begins with the provided prefix, and refines the
output type if possible.

This function is a wrapper around the built-in [`String.prototype.startsWith`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)
method, but doesn't expose the `startPosition` parameter. To check from a
specific position, use
`startsWith(sliceString(data, startPosition), prefix)`.

###### Data First

```
R.startsWith(data, prefix);
```

Expand

```
R.startsWith("hello world", "hello"); // true
R.startsWith("hello world", "world"); // false
```

###### Data Last

```
R.startsWith(prefix)(data);
```

Expand

```
R.pipe("hello world", R.startsWith("hello")); // true
R.pipe("hello world", R.startsWith("world")); // false
```

toCamelCase

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/toCamelCase.ts "View source on Github")

Converts text to **camelCase** by splitting it into words, lowercasing the
first word, capitalizing the rest, then joining them back together.

Because it uses the built-in case conversion methods, the function shares
their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_
too, making it best suited for simple strings like identifiers and internal
keys. For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters),
[`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
and [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase)
which are purpose-built to handle nuances in languages and locales.

For other case manipulations see: [`toLowerCase`](https://remedajs.com/docs/#toLowerCase), [`toUpperCase`](https://remedajs.com/docs/#toUpperCase), [`capitalize`](https://remedajs.com/docs/#capitalize),
[`uncapitalize`](https://remedajs.com/docs/#uncapitalize), [`toKebabCase`](https://remedajs.com/docs/#toKebabCase), [`toSnakeCase`](https://remedajs.com/docs/#toSnakeCase), and [`toTitleCase`](https://remedajs.com/docs/#toTitleCase).

For _PascalCase_ use `capitalize(toCamelCase(data))`.

###### Data First

```
R.toCamelCase(data);
R.toCamelCase(data, { preserveConsecutiveUppercase });
```

Expand

```
R.toCamelCase("hello world"); // "helloWorld"
R.toCamelCase("__HELLO_WORLD__"); // "helloWorld"
R.toCamelCase("HasHTML"); // "hasHTML"
R.toCamelCase("HasHTML", { preserveConsecutiveUppercase: false }); // "hasHtml"
```

###### Data Last

```
R.toCamelCase()(data);
R.toCamelCase({ preserveConsecutiveUppercase })(data);
```

Expand

```
R.pipe("hello world", R.toCamelCase()); // "helloWorld"
R.pipe("__HELLO_WORLD__", R.toCamelCase()); // "helloWorld"
R.pipe("HasHTML", R.toCamelCase()); // "hasHTML"
R.pipe("HasHTML", R.toCamelCase({ preserveConsecutiveUppercase: false })); // "hasHtml"
```

toKebabCase

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/toKebabCase.ts "View source on Github")

Converts text to **kebab-case** by splitting it into words and joining them
back together with hyphens ( `-`), then lowercasing the result.

Because it uses [`toLowerCase`](https://remedajs.com/docs/#toLowerCase),
the function shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_
too, making it best suited for simple strings like identifiers and internal
keys. For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters), and
[`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
which are purpose-built to handle nuances in languages and locales.

For other case manipulations see: [`toLowerCase`](https://remedajs.com/docs/#toLowerCase), [`toUpperCase`](https://remedajs.com/docs/#toUpperCase), [`capitalize`](https://remedajs.com/docs/#capitalize),
[`uncapitalize`](https://remedajs.com/docs/#uncapitalize), [`toCamelCase`](https://remedajs.com/docs/#toCamelCase), [`toSnakeCase`](https://remedajs.com/docs/#toSnakeCase), and [`toTitleCase`](https://remedajs.com/docs/#toTitleCase).

For _COBOL-CASE_ use `toUpperCase(toKebabCase(data))`.

###### Data First

```
R.toKebabCase(data);
```

Expand

```
R.toKebabCase("hello world"); // "hello-world"
R.toKebabCase("__HELLO_WORLD__"); // "hello-world"
```

###### Data Last

```
R.toKebabCase()(data);
```

Expand

```
R.pipe("hello world", R.toKebabCase()); // "hello-world"
R.pipe("__HELLO_WORLD__", R.toKebabCase()); // "hello-world"
```

toLowerCase

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/toLowerCase.ts "View source on Github")

Replaces all uppercase characters with their lowercase equivalents.

This function is a wrapper around the built-in
[`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
method and shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_.

For a more linguistically accurate transformation use [`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
and for display purposes use CSS [`text-transform: lowercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
which _is_ locale-aware.

For other case manipulations see: [`toUpperCase`](https://remedajs.com/docs/#toUpperCase), [`capitalize`](https://remedajs.com/docs/#capitalize),
[`uncapitalize`](https://remedajs.com/docs/#uncapitalize), [`toCamelCase`](https://remedajs.com/docs/#toCamelCase), [`toKebabCase`](https://remedajs.com/docs/#toKebabCase), [`toSnakeCase`](https://remedajs.com/docs/#toSnakeCase), and
[`toTitleCase`](https://remedajs.com/docs/#toTitleCase).

###### Data First

```
R.toLowerCase(data);
```

Expand

```
R.toLowerCase("Hello World"); // "hello world"
```

###### Data Last

```
R.toLowerCase()(data);
```

Expand

```
R.pipe("Hello World", R.toLowerCase()); // "hello world"
```

toSnakeCase

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/toSnakeCase.ts "View source on Github")

Converts text to **snake\_case** by splitting it into words and joining them
back together with underscores ( `_`), then lowercasing the result.

Because it uses [`toLowerCase`](https://remedajs.com/docs/#toLowerCase),
the function shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_
too, making it best suited for simple strings like identifiers and internal
keys. For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters), and
[`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
which are purpose-built to handle nuances in languages and locales.

For other case manipulations see: [`toLowerCase`](https://remedajs.com/docs/#toLowerCase), [`toUpperCase`](https://remedajs.com/docs/#toUpperCase), [`capitalize`](https://remedajs.com/docs/#capitalize),
[`uncapitalize`](https://remedajs.com/docs/#uncapitalize), [`toCamelCase`](https://remedajs.com/docs/#toCamelCase), [`toKebabCase`](https://remedajs.com/docs/#toKebabCase), and [`toTitleCase`](https://remedajs.com/docs/#toTitleCase).

For _CONSTANT\_CASE_ use `toUpperCase(toSnakeCase(data))`.

###### Data First

```
R.toSnakeCase(data);
```

Expand

```
R.toSnakeCase("hello world"); // "hello_world"
R.toSnakeCase("__HELLO_WORLD__"); // "hello_world"
```

###### Data Last

```
R.toSnakeCase()(data);
```

Expand

```
R.pipe("hello world", R.toSnakeCase()); // "hello_world"
R.pipe("__HELLO_WORLD__", R.toSnakeCase()); // "hello_world"
```

toTitleCase

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/toTitleCase.ts "View source on Github")

Converts text to **Title Case** by splitting it into words, capitalizing the
first letter of each word, then joining them back together with spaces.

Because it uses the built-in case conversion methods, the function shares
their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_,
making it best suited for simple strings like identifiers and internal keys.
For linguistic text processing, use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter#parameters),
[`toLocaleLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase),
and [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase)
which are purpose-built to handle nuances in languages and locales.

For other case manipulations see: [`toLowerCase`](https://remedajs.com/docs/#toLowerCase), [`toUpperCase`](https://remedajs.com/docs/#toUpperCase), [`capitalize`](https://remedajs.com/docs/#capitalize),
[`uncapitalize`](https://remedajs.com/docs/#uncapitalize), [`toCamelCase`](https://remedajs.com/docs/#toCamelCase), [`toKebabCase`](https://remedajs.com/docs/#toKebabCase), and [`toSnakeCase`](https://remedajs.com/docs/#toSnakeCase).

###### Data First

```
R.toTitleCase(data);
R.toTitleCase(data, { preserveConsecutiveUppercase });
```

Expand

```
R.toTitleCase("hello world"); // "Hello World"
R.toTitleCase("--foo-bar--"); // "Foo Bar"
R.toTitleCase("fooBar"); // "Foo Bar"
R.toTitleCase("__FOO_BAR__"); // "Foo Bar"
R.toTitleCase("XMLHttpRequest"); // "XML Http Request"
R.toTitleCase("XMLHttpRequest", { preserveConsecutiveUppercase: false }); // "Xml Http Request"
```

###### Data Last

```
R.toTitleCase()(data);
R.toTitleCase({ preserveConsecutiveUppercase })(data);
```

Expand

```
R.pipe("hello world", R.toTitleCase()); // "Hello World"
R.pipe("--foo-bar--", R.toTitleCase()); // "Foo Bar"
R.pipe("fooBar", R.toTitleCase()); // "Foo Bar"
R.pipe("__FOO_BAR__", R.toTitleCase()); // "Foo Bar"
R.pipe("XMLHttpRequest", R.toTitleCase()); // "XML Http Request"
R.pipe(
  "XMLHttpRequest",
  R.toTitleCase({ preserveConsecutiveUppercase: false }),
); // "Xml Http Request"
```

toUpperCase

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/toUpperCase.ts "View source on Github")

Replaces all lowercase characters with their uppercase equivalents.

This function is a wrapper around the built-in
[`String.prototype.toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
method and shares its _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase#description)_.

For a more linguistically accurate transformation use [`toLocaleUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase),
and for display purposes use CSS [`text-transform: uppercase;`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
which _is_ locale-aware.

For other case manipulations see: [`toLowerCase`](https://remedajs.com/docs/#toLowerCase), [`capitalize`](https://remedajs.com/docs/#capitalize),
[`uncapitalize`](https://remedajs.com/docs/#uncapitalize), [`toCamelCase`](https://remedajs.com/docs/#toCamelCase), [`toKebabCase`](https://remedajs.com/docs/#toKebabCase), [`toSnakeCase`](https://remedajs.com/docs/#toSnakeCase), and
[`toTitleCase`](https://remedajs.com/docs/#toTitleCase).

###### Data First

```
R.toUpperCase(data);
```

Expand

```
R.toUpperCase("Hello World"); // "HELLO WORLD"
```

###### Data Last

```
R.toUpperCase()(data);
```

Expand

```
R.pipe("Hello World", R.toUpperCase()); // "HELLO WORLD"
```

truncate

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/truncate.ts "View source on Github")

Truncates strings to a maximum length, adding an ellipsis when truncated.

Shorter strings are returned unchanged. If the omission marker is longer than
the maximum length, it will be truncated as well.

The `separator` argument provides more control by optimistically searching
for a matching cutoff point, which could be used to avoid truncating in the
middle of a word or other semantic boundary.

If you just need to limit the total length of the string, without adding an
`omission` or optimizing the cutoff point via `separator`, prefer
[`sliceString`](https://remedajs.com/docs/#sliceString) instead, which runs more efficiently.

The function counts Unicode characters, not visual graphemes, and may split
emojis, denormalized diacritics, or combining characters, in the middle. For
display purposes, prefer CSS [`text-overflow: ellipsis`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow#ellipsis)
which is locale-aware and purpose-built for this task.

###### Data First

```
R.truncate(data, n, { omission, separator });
```

Expand

```
R.truncate("Hello, world!", 8); //=> "Hello..."
R.truncate("cat, dog, mouse", 12, { omission: "__", separator: "," }); //=> "cat, dog__"
```

###### Data Last

```
R.truncate(n, { omission, separator })(data);
```

Expand

```
R.pipe("Hello, world!" as const, R.truncate(8)); //=> "Hello..."
R.pipe(
  "cat, dog, mouse" as const,
  R.truncate(12, { omission: "__", separator: "," }),
); //=> "cat, dog__"
```

uncapitalize

String [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/uncapitalize.ts "View source on Github")

Makes the first character of a string lowercase while leaving the rest
unchanged.

It uses the built-in [`String.prototype.toLowerCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
for the runtime and the built-in [`Uncapitalize`](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#Uncapitalizestringtype)
utility type for typing and thus shares their _[locale inaccuracies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase#description)_.

For display purposes, prefer using the CSS pseudo-element [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter) to target
just the first letter of the word, and [`text-transform: lowercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#lowercase)
to lowercase it. This transformation **is** locale-aware.

For other case manipulations see: [`toUpperCase`](https://remedajs.com/docs/#toUpperCase), [`toLowerCase`](https://remedajs.com/docs/#toLowerCase), [`capitalize`](https://remedajs.com/docs/#capitalize),
[`toCamelCase`](https://remedajs.com/docs/#toCamelCase), [`toKebabCase`](https://remedajs.com/docs/#toKebabCase), [`toSnakeCase`](https://remedajs.com/docs/#toSnakeCase), and [`toTitleCase`](https://remedajs.com/docs/#toTitleCase).

###### Data First

```
R.uncapitalize(data);
```

Expand

```
R.uncapitalize("HELLO WORLD"); // "hELLO WORLD"
```

###### Data Last

```
R.uncapitalize()(data);
```

Expand

```
R.pipe("HELLO WORLD", R.uncapitalize()); // "hELLO WORLD"
```

## utility

stringToPath

Utility [![GitHub](https://remedajs.com/icons/github.svg)View source on GitHub](https://github.com/remeda/remeda/blob/main/packages/remeda/src/stringToPath.ts "View source on Github")

A utility to allow JSONPath-like strings to be used in other utilities which
take an array of path segments as input (e.g. [`prop`](https://remedajs.com/docs/#prop), [`setPath`](https://remedajs.com/docs/#setPath), etc...).
The main purpose of this utility is to act as a bridge between the runtime
implementation that converts the path to an array, and the type-system that
parses the path string **type** into an array **type**. This type allows us
to return fine-grained types and to enforce correctness at the type-level.

We **discourage** using this utility for new code. This utility is for legacy
code that already contains path strings (which are accepted by Lodash). We
strongly recommend using _path arrays_ instead as they provide better
developer experience via significantly faster type-checking, fine-grained
error messages, and automatic typeahead suggestions for each segment of the
path.

_There are a bunch of limitations to this utility derived from the_
_limitations of the type itself, these are usually edge-cases around deeply_
_nested paths, escaping, whitespaces, and empty segments. This is true even_
_in cases where the runtime implementation can better handle them, this is_
_intentional. See the tests for this utility for more details and the_
_expected outputs_.

###### Data First

```
R.stringToPath(path);
```

Expand

```
R.stringToPath("a.b[0].c"); // => ['a', 'b', 0, 'c']
```
