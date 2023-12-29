const setValidity = (el, isValid, errMsg) => {
  if (isValid) {
    el.classList.remove('invalid');
    el.classList.add('valid');
    $(el).closest('.form-element').find('.error-message').text("");
  } else {
    el.classList.remove('valid');
    el.classList.add('invalid');
    $(el).closest('.form-element').find('.error-message').text(errMsg);
  }
  return isValid;
}

const getFormData = () => {
  const form = document.getElementById('main-form');
  return {
    'pet_name': form.elements.pet_name.value.trim(),
    'phone': form.elements.phone.value.trim(),
    'event_type': form.elements.event_type.value,
    'comments': form.elements.comments.value.trim(),
    'has_chip': form.elements.has_chip.checked
  };
}

const validateForm = () => {
  const form = document.getElementById('main-form');
  const petName = form.elements.pet_name;
  const phone = form.elements.phone;
  const phonePattern = /^\+?[-()\s]*\d[-()\s]*\d[-()\s]*\d[-()\s]*\d[-()\s]*\d[-()\s]*\d[-()\d\s]*$/;
  const eventType = form.elements.event_type;
  const $eventTypeContainer = $(eventType).closest('.form-element');
  const comments = form.elements.comments;
  const formData = getFormData();
  return [
    setValidity(petName, formData.pet_name.length > 0, "Unesite ime ljubimaca."),
    setValidity(phone, phonePattern.test(formData.phone), "Telefonski broj moze da sadrzi samo brojevi, razmake, certice i zagrade, a najmanje 6 cifara."),
    setValidity($eventTypeContainer[0], formData.event_type, "Odaberite bar nesto."),
    setValidity(comments, formData.comments.length > 0, "Objasnite sta, gde i kako se desilo."),
  ].reduce((a, c) => (a && c), true);
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!validateForm()) {
    return false;
  }
  const form = document.getElementById('main-form');
  const data = {
    'pet_name': form.elements.pet_name.value.trim(),
    'phone': form.elements.phone.value.trim(),
    'event_type': form.elements.event_type.value,
    'comments': form.elements.comments.value.trim(),
    'has_chip': form.elements.has_chip.checked,
    'pet_family': form.elements.pet_family.value
  }
  const jsonData = JSON.stringify(data, null, 4);

  const req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200 || req.status === 201) {
        // const response = JSON.parse(req.responseText);
        const resultNode = `<div><h2>Oglas jde poslat!</h2>Evo sto smo poslali na server: 
                                   <pre>${jsonData}</pre>
                                   A evo sto smo dobili: 
                                   <pre>${req.responseText}</pre>
                                   <a href="/">Na pocetni ekran</a></div>`;
        $("#form-container").replaceWith(resultNode);
      } else {
        $("#form-container").replaceWith('<h2 class="error-message">Doslo je do greske :(</h2><a href="/novi-oglas">Probajte ponovo!</a>');
      }
    }
  };
  req.open('POST', '/ajax/oglasi');
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(jsonData);
  return false;
}

window.onload = () => {
  const form = document.getElementById("main-form");
  $(form).on('submit', handleFormSubmit);
  $(form).find('input, textarea').on('blur', validateForm).on('input', validateForm);
}