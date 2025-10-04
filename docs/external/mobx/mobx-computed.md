Deriving information with computeds
Usage:

computed (annotation)
computed(options) (annotation)
computed(fn, options?)
@computed (getter decorator)
@computed(options) (getter decorator)
Computed values can be used to derive information from other observables. They evaluate lazily, caching their output and only recomputing if one of the underlying observables has changed. If they are not observed by anything, they suspend entirely.

Conceptually, they are very similar to formulas in spreadsheets, and can't be underestimated. They help in reducing the amount of state you have to store and are highly optimized. Use them wherever possible.

Example
Computed values can be created by annotating JavaScript getters with computed. Use makeObservable to declare a getter as computed. If you instead want all getters to be automatically declared as computed, you can use either makeAutoObservable, observable or extendObservable. Computed getters become non-enumerable.

To help illustrate the point of computed values, the example below relies on autorun from the Reactions {🚀} advanced section.

import { makeObservable, observable, computed, autorun } from "mobx"

class OrderLine {
    price = 0
    amount = 1

    constructor(price) {
        makeObservable(this, {
            price: observable,
            amount: observable,
            total: computed
        })
        this.price = price
    }

    get total() {
        console.log("Computing...")
        return this.price * this.amount
    }
}

const order = new OrderLine(0)

const stop = autorun(() => {
    console.log("Total: " + order.total)
})
// Computing...
// Total: 0

console.log(order.total)
// (No recomputing!)
// 0

order.amount = 5
// Computing...
// (No autorun)

order.price = 2
// Computing...
// Total: 10

stop()

order.price = 3
// Neither the computation nor autorun will be recomputed.
The above example nicely demonstrates the benefits of a computed value, it acts as a caching point. Even though we change the amount, and this will trigger the total to recompute, it won't trigger the autorun, as total will detect its output hasn't been affected, so there is no need to update the autorun.

In comparison, if total would not be annotated, the autorun would run its effect 3 times, as it would directly depend on total and amount. Try it out yourself.

computed graph

This is the dependency graph that would be created for the above example.

Rules
When using computed values there are a couple of best practices to follow:

They should not have side effects or update other observables.
Avoid creating and returning new observables.
They should not depend on non-observable values.
Tips
Tip: computed values will be suspended if they are not observed
Tip: computed values can have setters
{🚀} Tip: computed.struct for comparing output structurally
{🚀} Tip: computed values with arguments
{🚀} Tip: create standalone computed values with computed(expression)
Options {🚀}
computed usually behaves the way you want it to out of the box, but it's possible to customize its behavior by passing in an options argument.

name
This string is used as a debug name in the Spy event listeners and MobX developer tools.

equals
Set to comparer.default by default. It acts as a comparison function for comparing the previous value with the next value. If this function considers the values to be equal, then the observers will not be re-evaluated.

This is useful when working with structural data and types from other libraries. For example, a computed moment instance could use (a, b) => a.isSame(b). comparer.structural and comparer.shallow come in handy if you want to use structural / shallow comparison to determine whether the new value is different from the previous value, and as a result notify its observers.

Check out the computed.struct section above.

Built-in comparers
MobX provides four built-in comparer methods which should cover most needs of the equals option of computed:

comparer.identity uses the identity (===) operator to determine if two values are the same.
comparer.default is the same as comparer.identity, but also considers NaN to be equal to NaN.
comparer.structural performs deep structural comparison to determine if two values are the same.
comparer.shallow performs shallow structural comparison to determine if two values are the same.
You can import comparer from mobx to access these methods. They can be used for reaction as well.

requiresReaction
It is recommended to set this one to true on very expensive computed values. If you try to read its value outside of the reactive context, in which case it might not be cached, it will cause the computed to throw instead of doing an expensive re-evalution.

keepAlive
This avoids suspending computed values when they are not being observed by anything (see the above explanation). Can potentially create memory leaks, similar to the ones discussed for reactions.
