import React, { useRef, useEffect, useState } from "react";
import "./App.css";

import { ApplePayInstance } from "@recurly/recurly-js";
import { useRecurly, useCheckoutPricing } from "@recurly/react-recurly";

function App() {
  // Form State
  const [values, setValues] = useState({ plan: "bbq_club" });

  const recurly = useRecurly();
  const [pricingState, setCheckoutPricing] = useCheckoutPricing({
    subscriptions: [{ plan: values.plan }],
  });

  const [applePayIsReady, setApplePayIsReady] = useState(false);
  const applePayRef = useRef<ApplePayInstance>(null);

  const onApplePayClick = () => {
    if (!applePayIsReady) return console.warn("Apple Pay is not ready yet.");
    if (!applePayRef?.current) return console.warn("Apple Pay is empty.");
    console.debug("beginning payment with apple pay");
    applePayRef.current.begin();
  };

  useEffect(() => {
    // Exit early if this device does not support Apple Pay
    if (!window?.ApplePaySession)
      return console.debug("this browser does not support apple pay");

    // Create a new Apple Pay instance
    console.debug("starting apple pay");

    // @ts-ignore
    applePayRef.current = recurly.ApplePay({
      country: "US",
      currency: "USD",
      label: "Texas Monthly",
      total: "1",
      /**
       *=======================================================================
       *
       * Below is the crux of the problem. useCheckoutPricing() seems to be
       * returning a different object than recurly.ApplPay expects.
       *
       * ======================================================================
       */
      pricing: pricingState,
    });

    applePayRef.current.on("token", alert);

    applePayRef.current.on("error", console.error);

    applePayRef.current.on("cancel", () =>
      console.debug("cancelled apple pay")
    );

    applePayRef.current.ready(() => {
      console.debug("apple pay is ready");
      setApplePayIsReady(true);
    });

    // Remove the old event listeners if the selected plan changes
    return () => {
      if (!applePayRef?.current) return;
      console.debug("detaching event listeners from apple pay");
      applePayRef?.current?.off("token");
      applePayRef?.current?.off("error");
      applePayRef?.current?.off("cancel");
    };
  }, []);

  // Update pricing when the plan changes
  useEffect(() => {
    setCheckoutPricing({
      subscriptions: [{ plan: values.plan }],
    });
    console.debug(`changed plan to "${values.plan}"`);
  }, [values.plan, setCheckoutPricing]);

  return (
    <main className="App">
      <select
        name="plan"
        onChange={(event) => setValues({ plan: event.target.value })}
      >
        <option value="digital_monthly">Digital Monthly</option>
        <option value="bbq_club">BBQ Club</option>
      </select>

      <button type="button" onClick={onApplePayClick}>
        Pay with Apple Pay
      </button>
    </main>
  );
}

export default App;
