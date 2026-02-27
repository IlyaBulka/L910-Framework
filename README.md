# L910-Framework

## Вариант 4: Музей

### Сущности данных

#### 1. Экспонаты (exhibits.json)
- `id` - уникальный идентификатор (string)
- `name` - название экспоната (string)
- `artist` - автор (string)
- `year` - год создания (number)
- `isAvailable` - доступен для просмотра (boolean)
- `createdAt` - дата добавления в музей (Date string)
- `materials` - материалы (Array)

#### 2. Посетители (visitors.json)
- `id` - уникальный идентификатор (string)
- `name` - имя посетителя (string)
- `age` - возраст (number)
- `isStudent` - является ли студентом (boolean)
- `visitDate` - дата посещения (Date string)
- `ticketNumber` - номер билета (string)
- `exhibits` - IDs просмотренных экспонатов (Array)

### Маршруты API

#### Экспонаты
| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | /exhibits | Получить все экспонаты |
| GET | /exhibits/:id | Получить экспонат по ID |
| POST | /exhibits | Создать новый экспонат |
| PUT | /exhibits/:id | Полностью обновить экспонат |
| PATCH | /exhibits/:id | Частично обновить экспонат |
| DELETE | /exhibits/:id | Удалить экспонат |

#### Посетители
| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | /visitors | Получить всех посетителей |
| GET | /visitors/:id | Получить посетителя по ID |
| POST | /visitors | Создать нового посетителя |
| PUT | /visitors/:id | Полностью обновить посетителя |
| PATCH | /visitors/:id | Частично обновить посетителя |
| DELETE | /visitors/:id | Удалить посетителя |