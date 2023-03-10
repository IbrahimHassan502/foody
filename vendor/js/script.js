"use strict";
// initiate special of the week carousel
$(".special-carousel").owlCarousel({
  loop: true,
  margin: 5,
  nav: true,
  items: 1,
  center: true,
  dots: false,
  navText: [
    `<div><i class='icon-angle-left'></i><span>pr<br />ev</span></div>`,
    `<div><span>ne<br />xt</span><i class='icon-angle-right'></i></div>`,
  ],
});
// showing special of the week info
const veiled = document.querySelectorAll(".veiled");
veiled.forEach((veiledElement) =>
  veiledElement.addEventListener("click", (e) => {
    const veilButton = e.target.closest(".veil-btn");
    if (veilButton) {
      veilButton.classList.toggle("active");

      let veilItem;
      if (veilButton.dataset.veiltarget) {
        veilItem = document.querySelector(`.${veilButton.dataset.veiltarget}`);
      } else {
        veilItem = veilButton.parentElement;
      }
      if (!veilItem.classList.contains("veil-added")) {
        const veilContainer = document.createElement("div");
        veilContainer.classList.add("veil-container");
        veilContainer.innerHTML = `<div class="veil-first-left"></div>
              <div class="veil-first-right"></div>
              <div class="veil-second-left"></div>
              <div class="veil-second-right"></div>`;
        veilItem.appendChild(veilContainer);
      }
      veilItem.classList.add("veil-added");
      setTimeout(() => {
        veilItem.classList.toggle("veil-on");
      }, 0);
    }
  })
);
// food menu
const foodMenus = document.querySelectorAll(".menu");
function showMenu(menuArr, menu) {
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  menuArr.forEach((menu) => {
    const menuColumn = document.createElement("div");
    menuColumn.classList.add("menu-column");
    const menuHeading = document.createElement("h3");
    menuHeading.classList.add("menu-name");
    menuHeading.innerHTML = `${menu.name}`;
    menuColumn.append(menuHeading);
    menu.items.forEach((item) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item-container");
      itemContainer.innerHTML = `<div class="item-box">
                  <div class="check-box"></div>
                  <p class="item-name">${item.name}</p>
                  <input type="number" class="quantity" value="1" min="1" />
                  ${
                    item.addOns
                      ? `<div>
                          <i class="icon-plus add-ons-icon"></i>
                          <span class="price">$${item.price}</span>
                        </div>`
                      : `<span class="price">$${item.price}</span>`
                  }
                  ${
                    item.describtion
                      ? `<p class="item-description">${item.describtion}</p>`
                      : ``
                  }

                </div>`;
      if (item.addOns) {
        const addOnsList = document.createElement("ul");
        addOnsList.classList.add("add-ons-list");
        item.addOns.forEach((addOn) => {
          const li = document.createElement("li");
          li.innerHTML = `<div class="item-box">
                  <div class="check-box"></div>
                  <p class="item-name">${addOn.name}</p>
                  <input type="number" class="quantity" value="1" min="1" />
                  <span class="price">$${addOn.price}</span>
                  ${
                    addOn.describtion
                      ? `<p class="item-description">${addOn.describtion}</p>`
                      : ``
                  }
                  </div>
                </div>`;
          addOnsList.append(li);
        });
        itemContainer.append(addOnsList);
      }
      menuColumn.append(itemContainer);
    });
    gridContainer.append(menuColumn);
  });
  menu.append(gridContainer);
}
let mainMenu = [];
const getMenu = fetch("vendor/js/menu.json")
  .then((result) => (result = result.json()))
  .then((result) => {
    mainMenu = result;
    return mainMenu;
  })
  .then((mainMenu) => {
    const reservMenu = document.querySelector(".reserv .menu");
    showMenu(mainMenu, reservMenu);
    return mainMenu;
  });
// cart
const cart = {
  items: [],
  totalPrice: 0,
};
function calculatePrice() {
  cart.totalPrice = 0;
  cart.items.forEach((item) => {
    cart.totalPrice += Number(item.price) * Number(item.quantity);
  });
  const totalPrices = document.querySelectorAll(
    ".total-price-box .total-price"
  );
  totalPrices.forEach((price) => {
    price.innerHTML = `$${cart.totalPrice.toFixed(2)}`;
  });
}
function addOrRemoveItemToCart(add, clicked, quantity) {
  const menuName = clicked
    .closest(".menu-column")
    .querySelector(".menu-name").textContent;
  const itemName =
    clicked.parentElement.querySelector(".item-name").textContent;
  if (add) {
    const itemToAdd = mainMenu
      .find((menu) => menu.name === menuName)
      .items.find((item) => item.name === itemName);
    itemToAdd.quantity = quantity;
    cart.items.push(itemToAdd);
  } else {
    const itemIndex = cart.items.findIndex((item) => item.name === itemName);
    cart.items.splice(itemIndex, 1);
  }
}
function matchItemBoxes(clicked) {
  let clickedItemBox = [];
  const clickedMenu = clicked.closest(".menu");
  const clickedItemName = clicked
    .closest(".item-box")
    .querySelector(".item-name").textContent;
  const menusToCheck = [...foodMenus].filter(
    (menu) => menu.id !== clickedMenu.id
  );
  menusToCheck.forEach((menu) => {
    const itemBoxes = menu.querySelectorAll(".item-box");
    clickedItemBox.push(
      [...itemBoxes].find(
        (itemBox) =>
          itemBox.querySelector(".item-name").textContent === clickedItemName
      )
    );
  });
  return clickedItemBox;
}
foodMenus.forEach((menu) => {
  menu.addEventListener("click", (e) => {
    const clicked = e.target;
    if (clicked.classList.contains("check-box")) {
      clicked.classList.toggle("checked");
      const itemQuantity =
        clicked.parentElement.querySelector(".quantity").value;

      const addOrRemove = clicked.classList.contains("checked");
      addOrRemoveItemToCart(addOrRemove, clicked, itemQuantity);
      calculatePrice();
      const matchedItemBoxes = matchItemBoxes(clicked);
      if (matchedItemBoxes[0]) {
        if (addOrRemove) {
          matchedItemBoxes.forEach((box) => {
            box.querySelector(".check-box").classList.add("checked");
          });
        } else {
          matchedItemBoxes.forEach((box) => {
            box.querySelector(".check-box").classList.remove("checked");
          });
        }
      }
    } else if (clicked.classList.contains("add-ons-icon")) {
      clicked
        .closest(".item-box")
        .nextElementSibling.classList.toggle("active");
    }
  });
});
getMenu.then(() => {
  foodMenus.forEach((quantity) =>
    quantity.addEventListener("change", (e) => {
      const changedItemName = e.target
        .closest(".item-box")
        .querySelector(".item-name").textContent;
      cart.items.forEach((item) =>
        item.name === changedItemName ? (item.quantity = e.target.value) : ""
      );
      calculatePrice();
      const matchedItemBoxes = matchItemBoxes(e.target);
      if (matchedItemBoxes[0]) {
        matchedItemBoxes.forEach((box) => {
          box.querySelector(".quantity").value = e.target.value;
        });
      }
    })
  );
});
// menu categories
const menuCategories = document.querySelector(".menu-categories");
const menuCategoriesGrid = menuCategories.querySelector(".grid-container");
const menuCategoriesMenu = document.querySelector(".menu-categories .menu");
menuCategories.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("veil-btn") &&
    e.target.classList.contains("menu-box")
  ) {
    const menuName = e.target.dataset.name;
    const mainMenuColumns = document
      .querySelector("#menu-1")
      .querySelectorAll(".menu-column");
    const singleMenuColumn = [...mainMenuColumns].find(
      (column) => column.querySelector(".menu-name").textContent === menuName
    );
    menuCategoriesGrid.innerHTML = ``;
    menuCategoriesGrid.append(singleMenuColumn.cloneNode(true));
  }
});
// initiate reviews carousel
$(".reviews-carousel").owlCarousel({
  loop: true,
  margin: 5,
  nav: true,
  items: 1,
  center: true,
  dots: false,
  navText: [
    `<div><i class='icon-angle-left'></i><span>pr<br />ev</span></div>`,
    `<div><span>ne<br />xt</span><i class='icon-angle-right'></i></div>`,
  ],
});
// flipping clock
function fillSlot(clock, slot, intSlotNum) {
  const slotNum = Math.floor(intSlotNum).toString().split("");
  const fronts = clock.querySelectorAll(`.${slot} .front span`);

  if (slotNum.length > 1 && slotNum.length != 0) {
    fronts.forEach(
      (front) =>
        (front.textContent = front.parentElement.classList.contains("left")
          ? slotNum[0]
          : slotNum[1])
    );
  } else if (slotNum.length === 1) {
    fronts.forEach((front) => {
      front.textContent = front.parentElement.classList.contains("left")
        ? 0
        : slotNum[0];
    });
  }
}

const clock = document.querySelector(".clock-container");
// clock.addEventListener("click", () => {
//   console.log("working");
//   minusOne(seconds.querySelector(".group.right"));
// });
let timeInMills = 45020000 * 2;
const totalDayNum = timeInMills / (1000 * 60 * 60 * 24);
let intDayNum = Math.floor(totalDayNum);
fillSlot(clock, "days", intDayNum);
let intHourNum = (totalDayNum % 1) * 24;
fillSlot(clock, "hours", intHourNum);
let intMinuteNum = (intHourNum % 1) * 60;
fillSlot(clock, "minutes", intMinuteNum);
let intSecondNum = (intMinuteNum % 1) * 60;
fillSlot(clock, "seconds", intSecondNum);
function minusOne(group) {
  const topFront = group.querySelector(".top.front");
  const topRear = group.querySelector(".top.rear");
  const bottomFront = group.querySelector(".bottom.front");
  const bottomRear = group.querySelector(".rear.bottom");
  let startValue = Number(topFront.textContent);
  const groupLeafs = group.querySelectorAll(".leaf");
  // resetting when hitting minmum value
  if (startValue === 0) {
    const rotorClassList = group.closest(".rotor").classList;
    let totalToCheck;
    switch (rotorClassList[1]) {
      case "seconds":
        totalToCheck = timeInMills / 1000;
        break;
      case "minutes":
        totalToCheck = timeInMills / (1000 * 60);
        break;
      case "hours":
        totalToCheck = timeInMills / (1000 * 60 * 60);
        break;
      case "days":
        totalToCheck = timeInMills / (1000 * 60 * 60 * 24);
        break;
    }
    if (group.classList.contains("right")) {
      if (!rotorClassList.contains("hours")) {
        if (0 < totalToCheck && totalToCheck < 9) {
          startValue = 10;
        } else if (totalToCheck > 9) {
          startValue = 10;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else {
          return false;
        }
      } else {
        if (0 < totalToCheck && totalToCheck < 9) {
          startValue = 10;
        } else if (9 < totalToCheck && totalToCheck < 24) {
          startValue = 10;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else if (totalToCheck > 24) {
          startValue = 4;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else {
          return false;
        }
      }
    }
    if (group.classList.contains("left")) {
      if (!rotorClassList.contains("hours")) {
        if (totalToCheck > 9) {
          startValue = 6;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else if (totalToCheck < 9) {
          return false;
        }
      } else {
        if (totalToCheck > 9) {
          startValue = 3;
          const prevGroupId = `#group-${group.id.split("-")[1] - 1}`;
          minusOne(clock.querySelector(prevGroupId));
        } else if (totalToCheck < 9) {
          return false;
        }
      }
    }
  }
  // resetting when hitting minmum value

  topFront.classList.add("flip-front");
  bottomRear.classList.add("flip-rear");

  topRear.querySelector("span").textContent = startValue - 1;
  bottomRear.querySelector("span").textContent = startValue - 1;
  timeInMills -= 1000;
  setTimeout(() => {
    groupLeafs.forEach((leaf) => {
      leaf.classList.toggle("front");
      leaf.classList.toggle("rear");
    });
    topFront.classList.remove("flip-front");
    bottomRear.classList.remove("flip-rear");
    topFront.querySelector("span").textContent = startValue - 1;
    bottomFront.querySelector("span").textContent = startValue - 1;
  }, 850); //850 milliseconds
}
const seconds = document.querySelector(".clock-container .seconds");
setInterval(() => minusOne(seconds.querySelector(".group.right")), 1000);
