Обновление от 01.12.2019
# okbur.ru

Результат можно посмотреть [здесь](http://okbur.ru)
---
## Цель проекта

Личный сайт О.В. используется для публикации последних новостей или статей связанных с педагогической деятельностью.

## О проекте
Проект проходит обновление, из веденных обновлений:
* использование сборщика gulp
* flexbox

При этом архитектура проекта будет создаваться занова под новые потребности
* src - исходная
  - fonts - папка для хранения шрифтов
  - img - для картинок, но без иконок которые должны быть в корне...
  - js
  - scss
    - loading.scss для быстрой загрузки основных компонентов
    - style.scss для загрузки стилей после загрузки страницы
  - service - сервисные файлы для работы сайта с роботами и т.д.
  - template - шаблоны для html
  - index.html
* dist - для тестирования и публикации

### Настройка gulp - плагины
* Подготовка - удаление используем `del`, для очистки кэша `gulp-cache`
* По html `gulp-plumber` для отслеживание ошибок, далее `gulp-rigger` собираем в файлах все вставки из template. Затем используем проверку условия `gulp-if` и если у нас будет публикация то дополнительно используем `gulp-htmlmin` для минификации файлов html.
* по стилям styles используем также `gulp-plumber` для отслеживание ошибок, далее используем `node-sass-tilde-importer` для импорта стилей при установке через npm. Далее `gulp-concat` соединяет все файлы стилей в один. `gulp-autoprefixer` добавляет префиксы. Затем проверяем условие `gulp-if` и используем `gulp-clean-css` для минификации файла стилей
* Отслеживание изменений задача task watch - запускаем  `browser-sync` и отслеживаем html и styles
* по картинкам используем `gulp-imagemin`, при этом не забываем использовать `gulp-cache` для сброса кэша
* И остальные файлы просто перемещаем из папки src в соответствующую папку на dist и собираем их в build до отслеживания файлов.

### Инструменты
* Используемый [слайдер](https://kenwheeler.github.io/slick/)
* по [scss](https://sass-scss.ru/guide/)
* Да используется библиотека [jQuery](https://jquery.com/)
