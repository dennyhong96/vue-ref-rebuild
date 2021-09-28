// JS Proxy
const data = [
  { id: 123, name: "Denny", age: 24 },
  { id: 456, name: "Sharon", age: -24 },
  { id: 789, name: "Family", age: 135 },
];

const objects = data.map((person) => {
  return new Proxy(person, {
    get(target, prop, receiver) {
      if (prop in target) {
        if (prop === "age" && target[prop] >= 0 && target[prop] <= 130) {
          return target[prop];
        } else {
          throw new RangeError(`"${String(prop)}" must be between 0 and 130.`);
        }
      }
    },

    set(target, prop, value, receiver) {
      target[prop] = value;
      return true;
    },
  });
});

objects.forEach((person) => {
  try {
    console.log(person.age);
  } catch (error) {
    console.error((error as Error).message);
  }
});

Use an IIFE to protect access/mutation to raw object
const objProxy = (function (myObj) {
  return new Proxy(myObj, {
    // 'receiver' arg is a reference to the proxy object itself
    get(target, prop, receiver) {
      if (!(prop in target)) {
        throw new Error(`No such property - "${String(prop)}"`);
      }

      return target[prop as keyof typeof target];
    },

    set(target, prop, value, receiver) {
      if (!(prop in target)) {
        throw new Error(`No such property - "${String(prop)}"`);
      }

      target[prop] = value;
      return true;
    },
  });
})({ name: "Denny", age: 24 });

console.log(objProxy.age);
console.log(objProxy.name);

objProxy.name = "Sharon";
objProxy.age = 18;
console.log(objProxy.age);
console.log(objProxy.name);
