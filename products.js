const PRODUCTS = {
  bunny: {
    name: "Iepuraș",
    basePrice: 45,

    bases: [
      {
        name: "Cream",
        src: "Bunny_Colors/bunny-cream.png",
        style: { width: "180%", bottom: "-40px" }
      },
      {
        name: "Brown",
        src: "Bunny_Colors/bunny-brown.png",
        style: { width: "180%", bottom: "-40px" }
      }
    ],

    options: [
      {
        name: "Accesorii",
        type: "single",
        items: [
          {
            name: "Fără",
            price: 0,
            layers: []
          },
          {
            name: "Inimă",
            price: 7,
            layers: [
              {
                src: "Accessories/heart-red.png",
                style: {
                  left: "50%",
                  top: "66%",
                  width: "280px",
                  transform: "translate(-50%,-50%)"
                }
              }
            ]
          },
          {
            name: "Fundă",
            price: 3,
            layers: [
              {
                src: "Accessories/bow-pink.png",
                style: {
                  left: "63%",
                  top: "32%",
                  width: "205px",
                  transform: "translate(-50%,-50%) rotate(29deg)"
                }
              }
            ]
          }
        ]
      }
    ]
  }
};
