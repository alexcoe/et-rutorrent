
    Плагин "autotools", версия от 2010-05-26

    к WebUI для rTorrent (ruTorrent)
    (http://code.google.com/p/rutorrent)

    Автор плагина: Романовский Дмитрий (dmrom)

    Функции плагина:
1. "AutoLabel" : автоматическое формирование меток при добавлении нового
                 торрента через WebUI.
2. "AutoMove"  : автоматическое перенесение файлов торрента в другой каталог
                 после полного завершения закачки.
3. "AutoWatch" : автоматическое добавление торрентов в rTorrent с формированием
                 желаемой структуры каталогов сохраняемых данных.

-------------------------------------------------------------------------------
"AutoLabel"
-------------------------------------------------------------------------------

  Принцип формирования метки:
- Метка формируется по шаблону, который задается в настройках плагина.
Например: "{NOW}, {DIR}"
- Метка формируется только в случае, если поле ввода метки в диалоге
добавления торрента пустое.

Реализованы следующие переменные шаблона:

{DIR}: 
  Если в rtorrent.rc задана переменная "directory = /usr/p2p/downloads"
  и новый торрент сохраняется в /usr/p2p/downloads/Video/DVD/movie.avi,
  то в качестве данной переменной подставится "Video/DVD".

{TRACKER):
  В качестве данной переменной подставится имя трекера.

{NOW}:
  В качестве данной переменной подставится текущая дата. Для формирования
  даты используется функция strftime(). Формат даты по-умолчанию: "%Y-%m-%d".
  Возможно задать свой формат даты следующим способом: "{NOW[:<format>]}",
  например, "{NOW:%Y-%m-%d %H:%M}"


-------------------------------------------------------------------------------
"AutoMove"
-------------------------------------------------------------------------------
  Скачанные файлы торрента переносятся в каталог, указаный в конфигурации,
с сохранением структуры каталогов относительно директории, указанной в
переменной "directory" файла "rtorrent.rc" и уже оттуда запускаются на раздачу.

  Например:
  Если в rtorrent.rc задана переменная "directory = /usr/p2p/downloads",
а в качестве каталога для готовых закачек указан каталог "/media/p2p",
то файлы загружавшиеся в "/usr/p2p/downloads/Video/Movie/*.avi" будут 
перемещены в "/media/p2p/Video/Movie/*.avi" после завершения закачки.

  Планировалось применять плагин в случае, когда в качестве каталога для
готовых закачек монтируется другой диск или SMB ресурс с общим доступом.
Данное решение работает на FreeBSD, но, по мнению Novik, "под ядром 2.4
(какое имеет место быть, например, на роутере), раздача с smb и nfs
монтированных разделов идти не будет. Вызов mmap, который используется 
rtorrent на данных fs под данным ядром не работает".

  Плагин корректно обрабатывает ситуацию, когда файлы разных торрентов
сохраняются в один каталог - делается перенос файлов по списку торрента,
а не просто перенос базового каталога.

  Если в каталоге для загруженных файлов окажутся файлы с такими же именами,
как у завершившегося торрента, то они будут перезаписаны.

  Для удобства выбора каталога для завершенных закачек на хосте рекомендуется
установить сервисный плагин "_getdir", тогда появится возможность навигации по
файловой системе хоста.

  После успешного перемещения файлов плагин ищет файл ".mailto" в каталогах,
начиная от "/media/p2p/Video/Movie/ до "/media/p2p/. Если такой файл найден,
то посылается e-mail в соответствии с данными данного файла. 
Пример файла (без линий "==="):
===========================================
TO : user@domain.ru
FROM : Torrent Downloader<admin@domain.ru>
SUBJECT : Torrent "{TORRENT}" is finished!
Hello, User!

  Requested torrent

  "{TORRENT}"

  was successifully downloaded.
===========================================


-------------------------------------------------------------------------------
"AutoWatch"
-------------------------------------------------------------------------------
  Файлы *.torrent размещаются в подкаталогах желаемой структуры относительно
некоего базового каталога. Этот базовый каталог задается в настройках плагина.

  Плагин периодически производит поиск *.torrent файлов в его подкаталогах и,
при обнаружении файлов, добавляет их в rTorrent. При этом, при сохранении данных
торрента будет сформирована аналогичная структура каталогов, но уже относительно
каталога, указанного в переменной "directory" файла "rtorrent.rc".

  При ошибке добавления торрента, файл *.torrent будет переименован в *.torrent.fail


-------------------------------------------------------------------------------
История версий:
-------------------------------------------------------------------------------

    2010-05-26:
    - плагин адаптирован для ruTorrent версии 3.1
    - функция AutoLabel теперь может быть настроена с помошью шаблонов

    1.5
    - плагин адаптирован для ruTorrent версии 3.0

    1.4
    - добавлена функция AutoWatch
    - убраны скрипты *.sh, для инициализации плагина в rtorrent.rc рекомендуется
      использовать скрипт initplugins.php из основного каталога ruTorrent:
      execute = {sh,-c,full_path_to_php full_path_to_rutorrent/initplugins.php &}

    1.3
    - исправлена ошибка, приводившая к вылету rTorrent, если в именах подкаталогов
      торрента использовались служебные символы, типа ", ` и т.п.
    - попытка избежать лишнего рехэширования, которое иногда возникает.

    1.2
    - плагин переименован в autotools и объединен с automove 1.0
    - добавлена возможность устанавливать настройки в опциях ruTorrent

    1.1
    - обеспечение совместимости с плагинами retrackers и edit
    - плагин теперь запускается до retracker (runlevel.info: 5)

    1.0
    - первая версия

