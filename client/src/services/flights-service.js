class FlightsService {
  _getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` +
        `, received ${res.status}`);
    }

    return await res.json();
  }

  getFlights = async (url) => {
    return await this._getResource(url);
  }
}

export default new FlightsService();