import { ref, effect } from "@/ref";

describe("ref", () => {
  test("A single ref", () => {
    const fooRef = ref(1);

    let foo: number | undefined;

    effect(() => {
      foo = fooRef.value;
    });

    expect(foo).toBe(1);

    fooRef.value = 2;

    expect(foo).toBe(2);
  });

  test("Multiple refs", () => {
    interface Foo {
      name: string;
      age: number;
    }

    interface Bar {
      position: string;
      hobby: string;
    }

    const fooRef = ref<Foo>({ name: "Denny", age: 24 });
    const barRef = ref<Bar>({ position: "Frontend Developer", hobby: "Cars" });

    let foo: Foo | undefined;
    let foobar: (Foo & Bar) | undefined;

    effect(() => {
      foo = fooRef.value;
      foobar = { ...fooRef.value, ...barRef.value };
    });

    expect(foo).toEqual({ name: "Denny", age: 24 });
    expect(foobar).toEqual({
      name: "Denny",
      age: 24,
      position: "Frontend Developer",
      hobby: "Cars",
    });

    fooRef.value = { name: "Sharon", age: 27 };
    expect(foo).toEqual({ name: "Sharon", age: 27 });
    expect(foobar).toEqual({
      name: "Sharon",
      age: 27,
      position: "Frontend Developer",
      hobby: "Cars",
    });

    barRef.value = { position: "ABA", hobby: "Shopping" };
    expect(foo).toEqual({ name: "Sharon", age: 27 });
    expect(foobar).toEqual({
      name: "Sharon",
      age: 27,
      position: "ABA",
      hobby: "Shopping",
    });
  });
});
