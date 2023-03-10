import throttle from 'lodash.throttle';

const STORAGE_KEY = 'feedback-form-state';

const formData = {};
const formEl = document.querySelector('.feedback-form');
const emailEl = document.querySelector('input');
const messageEl = document.querySelector('textarea');

fillFeadbackFormFields();

formEl.addEventListener('submit', onFormSubmit);
formEl.addEventListener('input', throttle(onFormInput, 500));

function onFormSubmit(event) {
  event.preventDefault();

  event.currentTarget.reset();
  localStorage.removeItem(STORAGE_KEY);

  console.log(formData);

  formData.email = '';
  formData.message = '';
}

function onFormInput(event) {
  formData[event.target.name] = event.target.value;
  let dataString = JSON.stringify(formData);
  localStorage.setItem(STORAGE_KEY, dataString);
}

function fillFeadbackFormFields() {
  const savedMessage = localStorage.getItem(STORAGE_KEY);
  if (savedMessage) {
    let dataObject = JSON.parse(savedMessage);
    emailEl.value = dataObject.email;
    messageEl.value = dataObject.message;
    formData.email = dataObject.email;
    formData.message = dataObject.message;
  }
}
