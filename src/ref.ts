type Deps = Set<any>;
type KeyToDepsMap = Map<any, Deps>;

/**
 * targetMap: Map<any, KeyToDepMap> {
 *    [fooRef]: Map<any, Dep> {
 *      'value': [effect] as Set<any> // Whenever value changes, execute the list of effects
 *    }
 * }
 */
const targetsObj = new Map<any, KeyToDepsMap>();

let activeEffect: Function | undefined;

const track = (target: object) => {
  let depsMap: KeyToDepsMap | undefined = targetsObj.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetsObj.set(target, depsMap);
  }

  let deps: Deps | undefined = depsMap.get("value");
  if (!deps) {
    deps = new Set();
    depsMap.set("value", deps);
  }

  if (activeEffect) {
    deps.add(activeEffect);
  }

  console.log(targetsObj);
};

function trigger(target: object) {
  const depsMap = targetsObj.get(target);
  if (!depsMap) return;

  const deps = depsMap.get("value");
  if (!deps) return;

  deps.forEach((effect) => effect());
}

class RefImp<T> {
  constructor(private _value: T) {}

  get value() {
    track(this);
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    trigger(this);
  }
}

export function ref<T>(value: T) {
  return new RefImp(value);
}

export function effect(callback: Function) {
  activeEffect = callback;
  callback();
  activeEffect = undefined;
}
