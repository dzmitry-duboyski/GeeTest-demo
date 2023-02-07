# Решение капчи GeeTest в Puppeteer

## Алгоритм решения GeeTest:
1. Найти параметры качи `gt`, `challenge`, `api_server`:

    1.1. Найти значение `gt` можно в коде страницы.
    Скриншот:
    ![значение gt в коде страницы](./screenshot/gt_value.png)

    1.2 Найти значение `challenge` немного сложнее. 
    Для этого необходимо найти запрос, который делает капча на этой странице, этот запрос должен содержать значение `challenge`. 

    Ответ на запрос будет в следующем формате:
    `{"success":1,"challenge":"21aaa1c62221631516179b492b9e80cc","gt":"81388ea1fc187e0c335c0a8907ff2625"}`. Из этого ответа необходимо взять значение `challenge`. 

    >Если рассматривать пример с капчей на странице https://rucaptcha.com/demo/geetest, то в этом случае это будет запрос к https://rucaptcha.com/api/v1/captcha-demo/gee-test/. Ответ на этот запрос содержит необходимый `challenge`.
    >Ответ: `{"success":1,"challenge":"21aaa1c62221631516179b492b9e80cc","gt":"81388ea1fc187e0c335c0a8907ff2625"}`.
    >
    >Скриншот:
    ![значение challenge в коде страницы](./screenshot/challenge_value.png)

    Подробнее про challenge можно почитать [тут](https://rucaptcha.com/api-rucaptcha#solving_geetest:~:text=%D0%92%D0%B0%D0%B6%D0%BD%D0%BE%3A%20%D0%B4%D0%BB%D1%8F,%D0%B8%20%D0%BF%D0%B0%D1%80%D1%81%D0%B8%D1%82%D1%8C%20%D0%B5%D0%B3%D0%BE.).

2. Отправка капчи в API.

Для решения капчи, необходимо отправить в API найденные параметры капчи:
```json
"key":"your_api_key",
"method":"geetest"
"pageurl":"https://rucaptcha.com/demo/geetest"
"gt": "81388ea1fc187e0c335c0a8907ff2625",
"challenge": "21aaa1c62221631516179b492b9e80cc"
```

3. Получение решения капчи.

После успешного решения капчи, API вернет ответ с решением. Пример ответа с решением от API:
```json
{
   "status": 1,
   "request": {
       "geetest_challenge": "fd4847c8a368356a0e3a6636392c2854k9",
       "geetest_validate": "4606cdf89c8c2e5a43c5a14fe475fc40",
       "geetest_seccode": "4606cdf89c8c2e5a43c5a14fe475fc40|jordan"
   }
}
```

4. Вставка решения.
Полученные значения необходмо вставить в соответствующие html элементы GeeTest капчи на странице.

Пример:
```html
<div class="geetest_form">
  <input type="hidden" name="geetest_challenge" value="fd4847c8a368356a0e3a6636392c2854k9">
  <input type="hidden" name="geetest_validate" value="4606cdf89c8c2e5a43c5a14fe475fc40">
  <input type="hidden" name="geetest_seccode" value="4606cdf89c8c2e5a43c5a14fe475fc40">
</div>
```

Скриншот:
![вставляем ответ в html элементы GeeTest капчи на странице](./screenshot/answer_in_html.png)

Готово. После этого можно переходить к выполнению действий на странице. В этом примере после этого происходит нажатие на кнопку "Проверить". 

Код решения доступен в файле [index.js](/index.js)

Дополнительная информация:
- [Документаця по отправке GeeTest](https://rucaptcha.com/api-rucaptcha#solving_geetest).
- [Демо страница GeeTest](https://rucaptcha.com/demo/geetest) с описанием решения.