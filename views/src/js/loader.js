const loader = document.getElementById("loader");
const main = document.getElementById("main");

if (window.location.pathname === "/") {
  loader.style.display = "flex";
  main.style.display = "none";

  setTimeout(function () {
    loader.style.display = "none";
    main.style.display = "";
    document.body.style.overflow = "auto";
  }, 3000);
} else {
  loader.style.display = "none";
  main.style.display = "";
  document.body.style.overflow = "auto";
}
