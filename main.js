import 'milligram';
import './style.css';
import $ from "cash-dom";

const username = $('#username')
const buttonCreate = $('#button-create');
const widgetContainer = $("#telegram-login-container");

/**
 * 
 * @param {string} name 
 */
function isBotNameValid(name) {
  if (!name) return false;
  return name.toLowerCase().endsWith("bot")
}

username.on('input', () => {
  const value = username.val();
  buttonCreate.prop('disabled', !isBotNameValid(value))
});

buttonCreate.on('click', () => {
  const value = username.val();
  
  const scriptElement = buildWidget(value, () => {
    buttonCreate.prop('disabled', false);
  });

  widgetContainer.empty();
  widgetContainer.append(scriptElement);
  buttonCreate.prop("disabled", true);
 
});

window.onTelegramAuth = function (user) {
  console.log(user);
  window.user = user;
  $("#code-output").text(JSON.stringify(user, null, 2));
}

function buildWidget(name, onLoad = () => {} ) {
  const s = document.createElement('script');
  s.async = true;
  s.src = "https://telegram.org/js/telegram-widget.js?15";
  s.setAttribute("data-telegram-login", name);
  s.setAttribute("data-size", 'large');
  s.setAttribute("data-userpic", 'true');
  s.setAttribute("data-radius", '20');
  s.setAttribute("data-onauth", 'onTelegramAuth(user)');
  s.setAttribute("ata-request-access", 'write');
  s.addEventListener("load", onLoad);
  return s;
}