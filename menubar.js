// Pull-down menus are <details class="menu">. Keep one open at a time; close on outside click, item choice or Escape.
const closeMenus = (except) => {
  for (const menu of document.querySelectorAll("details.menu[open]")) if (menu !== except) menu.open = false;
};
document.addEventListener("click", (event) => {
  const menu = event.target.closest("details.menu");
  closeMenus(event.target.closest(".menu-list") ? null : menu);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenus(null);
});
