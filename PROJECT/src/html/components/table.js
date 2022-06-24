class Table extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <table class="events-table-SELF" cellspacing="0" cellpadding="0">

        <th colspan="2">15:20 - 17:20</th>





        <tr>
          <td>Квест</td>
          <td>Рекреация 2 этажа
          Солянки
          </td>
        </tr>

        <tr>
          <td>Гадание на картах
          Таро
          </td>
          <td>Рекреация 3 этажа
          Солянки
          </td>
        </tr>
        
        

        <tr>
          <td>Мафия </td>
          <td>Футбольная
          коробка заднего
          двора Солянки</td>
        </tr>

        <tr>
          <td>H2O-понг</td>
          <td>Двор Солянки</td>
        </tr>

        <tr>
          <td>Фотозона </td>
          <td>Рекреация 2 этажа
          Солянки</td>
        </tr>

        <tr>
          <td>Ярмарка Charity
          market</td>
          <td>Входная группа 1
          этажа Солянки</td>
        </tr>



        <tr>
          <td>Крокодил</td>
          <td>Футбольная
          коробка заднего
          двора Солянки
          </td>
        </tr>

        <tr>
        <td>Твистер</td>
        <td>Футбольная
        коробка заднего
        двора Солянки
        
        </td>
      </tr>

        
        
      



        <tr>
          <td>Спиддейтинг</td>
          <td>Двор Солянки</td>
        </tr>

        
      <tr>
      <td>Глиттер станция</td>
      <td>Двор Солянки</td>
    </tr>

        <tr>
          <td>Зона с пуфиками</td>
          <td>Футбольная
          коробка заднего
          двора Солянки</td>
        </tr>


        <tr>
        <td>Медитация</td>
        <td>301с</td>
      </tr>

      <tr>
        <td>Мастер-класс по
        украшениям</td>
        <td>202с</td>
      </tr>

      <tr>
          <td>Шахматы, шашки</td>
          <td>201с</td>
      </tr>

        
        <th colspan="2">15:20 - 16:20</th>
        <tr>
          <td>Практикум в лаборатории</td>
          <td>501с</td>
        </tr>

        <th colspan="2">15:30 - 17:00</th>
        <tr>
          <td>Рисование на шопперах
          </td>
          <td>203с</td>
        </tr> 




        <th colspan="2">15:40 - 16:40</th>
        <tr>
          <td>Гитарник от Lyc Music</td>
          <td>Футбольная
          коробка заднего
          двора Солянки</td>
        </tr>

        <th colspan="2">15:40 - 17:20</th>
        <tr>
          <td>Волейбол</td>
          <td>Спортзал на Ляле</td>
        </tr>
        

        
        
        

        
        
        

      </table>

        `;
  }
}

customElements.define("table-component", Table);
