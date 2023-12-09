import { useState, useEffect } from "react";
import LocalPizzaOutlinedIcon from "@mui/icons-material/LocalPizzaOutlined";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import CelebrationTwoToneIcon from "@mui/icons-material/CelebrationTwoTone";
import AddIcon from "@mui/icons-material/Add";
import CircularIndeterminate from "./CircularIndeterminate";

const currency = "zł";
const standardSize = "standard 24 cm";
const largeSize = "duży 32 cm";
const errorMessage = "nie udało się pobierać danych... Spróbuj poźniej.";
let standardPriceClasses = "text-sm lg:text-xl text-right font-bold";

async function getMenu(selectedMenu) {
  const menuPath = selectedMenu === "dodatkis" ? "addons" : selectedMenu;
  const res = await fetch(
    `http://panel.kebab-hassan.pl/wp-json/wp/v2/${menuPath}`
  );

  if (!res.ok) {
    throw new Error(errorMessage);
  }

  return res.json();
}

export default function Menu({ selectedMenu }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getMenu(selectedMenu);
        setMenuItems(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [selectedMenu]);

  return (
    <div className="p-4 bg-stone-900/90 rounded-xl">
      {selectedMenu === "pizzas" && (
        <p className="mb-4 text-md text-right">
          <span className="mx-2 py-2 px-4 bg-orange-500 text-white rounded-full italic">
            {standardSize}{" "}
          </span>
          <span className="text-stone-500"> / </span>
          <span className="mx-2 py-2 px-4 bg-stone-300 text-stone-900 rounded-full italic">
            {largeSize}
          </span>
        </p>
      )}

      <ul className="mt-8">
        {isLoading && <CircularIndeterminate />}

        {menuItems &&
          menuItems.map((item) => (
            <li className="flex items-center gap-2 lg:gap-4 mb-8" key={item.id}>
              {selectedMenu === "pizzas" && <LocalPizzaOutlinedIcon />}
              {selectedMenu === "kebabs" && <CelebrationTwoToneIcon />}
              {selectedMenu === "addons" && <AddIcon />}
              {item.acf.menuOrder && (
                <span className="text-xs">{item.acf.menuOrder}.</span>
              )}
              <div className="grow">
                <div className="flex">
                  <h4 className="lg:text-xl font-bold text-orange-500">
                    {item.acf.name}
                  </h4>
                  {item.acf.spicy > 0 && (
                    <span className="text-orange-500">
                      &nbsp;
                      {Array.from({ length: item.acf.spicy }, (_, index) => (
                        <LocalFireDepartmentRoundedIcon
                          key={index}
                          className="text-red-500"
                        />
                      ))}
                    </span>
                  )}
                  {item.acf.customLabelAfterName && (
                    <span className="text-orange-500 italic">
                      &nbsp;⌀ {item.acf.customLabelAfterName}
                    </span>
                  )}
                  <div className="grow border-b-2 border-dotted border-stone-500"></div>
                  {item.acf.priceS && (
                    <div
                      className={`${standardPriceClasses} bg-stone-700 rounded-full mx-2 px-4`}
                    >
                      {selectedMenu === "addons" && (
                        <span className="text-xs">mały </span>
                      )}
                      {item.acf.priceS}
                      <span className="text-xs"> {currency}</span>
                    </div>
                  )}
                  {item.acf.priceM && (
                    <div
                      className={`${standardPriceClasses} bg-orange-500 rounded-full mx-2 px-4`}
                    >
                      {item.acf.priceM}
                      <span className="text-xs"> {currency}</span>
                    </div>
                  )}
                  {item.acf.priceL && (
                    <div
                      className={`${standardPriceClasses} bg-stone-300 text-stone-900 rounded-full mx-2 px-4`}
                    >
                      {selectedMenu !== "kebabs" && (
                        <span className="text-xs">duży </span>
                      )}
                      {item.acf.priceL}
                      <span className="text-xs"> {currency}</span>
                    </div>
                  )}
                </div>

                <span className="text-sm text-stone-400">
                  {item.acf.ingredients}
                </span>
              </div>
            </li>
          ))}
      </ul>

      {}
    </div>
  );
}
