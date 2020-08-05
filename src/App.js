import React, { useState, useEffect } from "react";
import Client from "shopify-buy";
import "./App.css";

const client = Client.buildClient({
  domain: "midnight45.myshopify.com/",
  storefrontAccessToken: "8dd7b6d4373f36433b20180e75cb0828",
});

function App() {
  const [product, setProduct] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [checkedVariant, setCheckedVariant] = useState(null);
  const [loader, setLoader] = useState(false);

  const handle = "minimalistic-black-dress";

  useEffect(() => {
    client.product.fetchByHandle(handle).then((product) => {
      setProduct(product);
      console.log("propd-->", product);
    });

    client.checkout.create().then((checkout) => {
      setCheckout(checkout);
      console.log("checkout-->", checkout);
    });
  }, []);

  const onAddClick = async () => {
    setLoader(true);
    const checkoutId = checkout.id;
    const input = {
      customAttributes: [{ key: "fromLanding", value: "Landing" }],
    };

    console.log("prodId-->", typeof prodId);

    const addedAttributes = await client.checkout.updateAttributes(
      checkoutId,
      input
    );

    console.log("atr-->", addedAttributes);

    const lineItemsToAdd = [
      {
        variantId: checkedVariant,
        quantity: 1,
      },
    ];

    const checkoutAdded = await client.checkout.addLineItems(
      checkoutId,
      lineItemsToAdd
    );

    console.log(checkoutAdded.lineItems); // Array with one additional line item

    const shippingAddress = {
      address1: "Chestnut Street 92",
      address2: "Apartment 2",
      city: "Louisville",
      company: null,
      country: "United States",
      firstName: "Bob",
      lastName: "Norman",
      phone: "555-625-1199",
      province: "Kentucky",
      zip: "40202",
    };

    const addedAddress = await client.checkout.updateShippingAddress(
      checkoutId,
      shippingAddress
    );

    console.log("withAddress-->", addedAddress);

    setLoader(false);
    document.location.href = checkout.webUrl;
  };

  const onChoseSize = (e) => setCheckedVariant(e.target.value);

  return (
    <div>
      {loader && (
        <div className="loader">
          <p className="text">LOADING</p>
        </div>
      )}
      <h1>TEST SHOPIFY</h1>
      {product && checkout && (
        <>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>
            <div id="variant" onChange={onChoseSize}>
              {product.variants.map((variant) => (
                <label key={variant.id}>
                  <input
                    type="radio"
                    name="variant"
                    value={variant.id}
                    id={variant.id}
                  />
                  {variant.selectedOptions[0].value}
                </label>
              ))}
            </div>
          </p>
          <img src={product.images[0].src} alt="product" width="150" />
          <p>price{product.attrs.variants[0].price}</p>

          {checkedVariant && (
            <button type="button" onClick={onAddClick}>
              ADD
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
