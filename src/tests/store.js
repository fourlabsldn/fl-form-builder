/* eslint-env jasmine */
import { asyncDispatchMiddleware } from "../js/store";

const fakeAction = { type: "fake action" };

describe("The asyncDispatchMiddleware", () => {
  it("calls next with asyncDispatch property", (done) => {
    const next = returnedAction => {
      expect(returnedAction.asyncDispatch).not.toEqual(undefined);
      expect(typeof returnedAction.asyncDispatch).toEqual("function");
      done();
    };

    asyncDispatchMiddleware("fakeStore")(next)(fakeAction);
  });


  it("asyncDispatch triggers a store dispatch", (done) => {
    const fakeAsyncAction = { type: "fakeAsyncAction" };

    const fakeStore = {
      dispatch: action => {
        expect(action.type).toEqual(fakeAsyncAction.type);
        done();
      },
    };

    const next = returnedAction =>
      returnedAction.asyncDispatch(fakeAsyncAction);

    asyncDispatchMiddleware(fakeStore)(next)(fakeAction);
  });
});
