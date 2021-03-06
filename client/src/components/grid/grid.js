import FlightsService from "../../services/flights-service";
import './grid.css';

class GridComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getLocalHour = ({ Year: year, Month: month, DayofMonth: day }, time) => {
    const date = new Date(
      new Date(`${year}/${month}/${day}`)
        .getTime() + (Number(time) * 60 * 1000)
    );
    const h = date.getHours(), m = date.getMinutes();

    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
  }

  getLocalHumanDate = ({ Year: year, Month: month, DayofMonth: day }) => {
    const date = new Date(`${year}/${month}/${day}`);
    const dateArr = date.toString().split(' ');

    return `${dateArr[2]} ${dateArr[1]}, ${date.getFullYear()}`;
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    FlightsService.getFlights('/api/flights').then(({ items, total }) => {
      this.total = total;
      this.items = items;

      const gridContent = items.reduce((res, flight) => {
        return res += `
          <div class="grid__item">
            <div class="grid__item-header">
              <span class="tail-code" data-tooltip="Carrier plane's tail number<br>or 'Cancelled' if flight was cancelled">
                ${+flight.Cancelled ? 'Cancelled' : flight.TailNum}
              </span>
              <span class="flight-num" data-tooltip="Flight number">/ ${flight.FlightNum}</span>
              <div class="grid__item-date" data-tooltip="Date of flight">${this.getLocalHumanDate(flight)}</div>
            </div>
            <div class="grid__item-flight-info">
              <div class="grid__item-info-block">
                <div class="grid__item-info-loc" data-tooltip="Country code from which the plane flew">
                  ${flight.Origin}
                </div>
                <div class="grid__item-time">
                    <span>scheduled</span>
                    <time data-tooltip="Scheduled departure time">${this.getLocalHour(flight, flight.CRSDepTime)}</time>
                </div>
                ${
                  !+flight.Cancelled ? `
                    <div class="grid__item-time">
                      <span>actual</span>
                      <time data-tooltip="Actual departure time">${this.getLocalHour(flight, flight.DepTime)}</time>
                    </div>
                  ` : ''
                }
              </div>
              <div class="grid__item-info-block">
                <div class="grid__item-info-loc" data-tooltip="Country code where the plane flew">
                  ${flight.Dest}
                </div>
                <div class="grid__item-time">
                    <span>scheduled</span>
                    <time data-tooltip="Scheduled arrival time">${this.getLocalHour(flight, flight.CRSArrTime)}</time>
                </div>
                ${
                  !+flight.Cancelled ? `
                     <div class="grid__item-time">
                      <span>actual</span>
                      <time data-tooltip="Actual arrival time">${this.getLocalHour(flight, flight.ArrTime)}</time>
                    </div>
                  ` : ''
                }
              </div>     
            </div>
            <div class="grid__item-distance-block">
              <div class="grid__item-distance${!+flight.Cancelled ? ' distance-filled' : ''}">
                <svg style="fill: #6d6d6d;" width="16" height="16" id="icon-aircraft-progress" viewBox="0 0 31.9 28.000643">
                    <g transform="translate(-4.8,-5.9)"><path style="fill: #6d6d6d;" d="m33.5 22.5c-1.9 0.1-6.7-0.1-6.7-0.1s-8.2 11.6-9.5 11.5c-1.2-0.1-2.6-0.4-2.6-0.4s6-11.4 4.5-11.3-8.1-0.2-8.1-0.2-3.7 4.6-4.1 4.5c-0.4 0-2.2-0.2-2.2-0.2s2.1-5.2 2.1-6.4v-0.1c0-1.2-2.1-6.4-2.1-6.4s1.7-0.2 2.2-0.2c0.4 0 4.2 4.5 4.2 4.5s6.6-0.3 8.1-0.2-4.5-11.3-4.5-11.3 1.2-0.2 2.5-0.3c1.3 0.1 9.6 11.7 9.6 11.7s4.8-0.1 6.7-0.1c1.9 0.1 3.1 2.5 3.1 2.5-0.1 0.2-1.3 2.5-3.2 2.5z" fill="#f8c024"></path></g>
                </svg>    
              </div>
              <div class="grid__item-distance-label">
                <span data-tooltip="Flight distance">${this.numberWithCommas(flight.Distance)}km</span>
                ${!+flight.Cancelled ? `<span data-tooltip="Elapsed time of the flight, in minutes">${flight.ActualElapsedTime}m</span>` : ''}
              </div>
            </div>
          </div>
        `;
      }, '');

      this.parent.innerHTML +=  `
        <div class="container">
          <div class="grid">
            ${gridContent}
          </div>
        </div>
      `;
    }).catch(err => console.log("Fetch err:", err.message));
  }
}

export default GridComponent;
