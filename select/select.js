const getTemplate = (data = [], placeholder, selectedId) => {
  let text = placeholder ?? "Placeholder по умолчанию";

  const items = data.map((item) => {
    let cls = "";
    if (item.id === selectedId) {
      text = item.value;
      cls = "selected";
    }
    return `
            <li class="select__item" ${cls} data-type="item" data-id="${item.id}">${item.value}</li>
        `;
  });

  return `
        <div class="select__backdrop" data-type="backdrop"></div>
     <div class="select__input" data-type="input">
            <span data-type="value">${text}</span>
            <i class="fa fa-chevron-down" data-type="arrow"></i>
          </div>
          <div class="select__dropdown">
            <ul class="select__list">
              ${items.join("")}
            </ul>
          </div>
    `;
};

export class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.selctedId = options.selectedId;

    this.#render();
    this.#setup();
  }

  // # - делает метод приватным, метод доступен только внутри класса Select
  // метод для отрисовки HTML
  #render() {
    const { placeholder, data } = this.options;
    this.$el.classList.add("select");
    this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
  }

  //   метод для настройки динамики дропдауна
  #setup() {
    // что бы контекст у функции не терялся, я его привязал принудительно
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener("click", this.clickHandler);
    // нахожу иконку стрелочки
    this.$arrow = this.$el.querySelector('[data-type="arrow"]');
    this.$value = this.$el.querySelector('[data-type="value"]');
  }

  clickHandler(event) {
    const { type } = event.target.dataset;

    if (type === "input") {
      this.toggle();
    } else if (type === "item") {
      const id = event.target.dataset.id;
      this.select(id);
    } else if (type === "backdrop") {
      this.close();
    }
  }

  // геттер для проверки открыт ли дропдаун
  get isOpen() {
    return this.$el.classList.contains("open");
  }

  // возвращает актуальный выбраный элемент листа
  get current() {
    return this.options.data.find((item) => item.id === this.selctedId);
  }

  select(id) {
    this.selctedId = id;
    this.$value.textContent = this.current.value;

    this.$el.querySelectorAll('[data-type="item"]').forEach((el) => {
      el.classList.remove("selected");
    });
    this.$el.querySelector(`[data-id="${id}"]`).classList.add("selected");

    this.options.onSelect ? this.options.onSelect(this.current) : null;
    this.close();
  }

  // красивый переключатель. Если дропдаун открыт - закрывает и наоборот
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.$el.classList.add("open");
    this.$arrow.classList.remove("fa-chevron-down");
    this.$arrow.classList.add("fa-chevron-up");
  }
  close() {
    this.$el.classList.remove("open");
    this.$arrow.classList.add("fa-chevron-down");
    this.$arrow.classList.remove("fa-chevron-up");
  }

  destroy() {
    this.$el.removeEventListener("click", this.clickHandler);
    this.$el.innerHTML = "";
  }
}
