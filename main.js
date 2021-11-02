import 'milligram';
import './style.css';
import $ from "cash-dom";
import sha256 from 'crypto-js/sha256'
import hmacSHA256 from "crypto-js/hmac-sha256";
import Hex from "crypto-js/enc-hex";

const username = $('#username')
const buttonCreate = $('#button-create');
const widgetContainer = $("#telegram-login-container");

const tokenEl = $('#token')
const dataEl = $('#data')
const messageEl = $('#message');

tokenEl.on('input', () => onValueChanges());
dataEl.on("input", () => onValueChanges());

function parseData(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

function validate(data, token) {

  const checkString = Object.keys(data)
     .filter((key) => key !== "hash")
     .map((key) => `${key}=${data[key]}`)
     .sort()
     .join("\n");
  
  const secret = sha256(token);
  const result = Hex.stringify(hmacSHA256(checkString, secret));

  console.log({
    data,
    token,
    checkString 
  })

  return data.hash === result;
}

function onValueChanges() {
  const data = parseData(dataEl.val());
  const token = tokenEl.val();
  if (data && token) {
    const isValid = validate(data, token.trim());
      messageEl.removeClass('verified')
    if (isValid) {
      messageEl.removeClass("not-verified");
      messageEl.addClass('verified').text('Verified');
    } else {
      messageEl.removeClass('verified')
      messageEl.addClass("not-verified").text("Not Verified");
    }

    return;
  }
  messageEl.removeClass("verified");
  messageEl.removeClass("not-verified");
  messageEl.text('Invalid')
}


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