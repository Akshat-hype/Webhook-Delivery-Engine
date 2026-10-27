
// function calculateAverage(numbers) {
//       return numbers.reduce((sum, num) => sum + num) / numbers.length;
// }

// function getUserName(user) {
//       return user.name.toUpperCase();
// }

// function applyDiscount(price, discountPercent) {
//       return price - discountPercent / 100;
// }

// function isValidAge(age) {
//       return age >= 18 || age <= 120;
// }

// function addItem(cart, item) {
//       cart.push(item);
//         return cart;
// }


function calculateAverage(numbers) {
      if (!Array.isArray(numbers) || numbers.length === 0) {
            return null;
      }

        const total = numbers.reduce((sum, num) => sum + num, 0);
          return total / numbers.length;
    }

    function getUserName(user) {
          if (!user || typeof user.name !== "string") {
                return "Unknown";
          }

            return user.name.toUpperCase();
        }

        function applyDiscount(price, discountPercent) {
              if (
                    typeof price !== "number" ||
                        !Number.isFinite(price) ||
                            price < 0 ||
                                typeof discountPercent !== "number" ||
                                    !Number.isFinite(discountPercent) ||
                                        discountPercent < 0 ||
                                            discountPercent > 100
              ) {
                    throw new Error("Invalid price or discount percentage");
              }

                return price * (1 - discountPercent / 100);
            }

            function isValidAge(age) {
                  return (
                        typeof age === "number" &&
                            Number.isInteger(age) &&
                                age >= 18 &&
                                    age <= 120
                  );
                }

                function addItem(cart, item) {
                      return [...cart, item];
                }




                console.log(calculateAverage([10, 20, 30])); // 20
                console.log(calculateAverage([]));           // null

                console.log(getUserName({ name: "akshat" })); // AKSHAT
                console.log(getUserName(null));               // Unknown

                console.log(applyDiscount(1000, 20));         // 800

                console.log(isValidAge(25));  // true
                console.log(isValidAge(150)); // false
                console.log(isValidAge(10));  // false

                const originalCart = ["Book"];
                const updatedCart = addItem(originalCart, "Laptop");

                console.log(originalCart); // ["Book"]
                console.log(updatedCart);  // ["Book", "Laptop"]
                
