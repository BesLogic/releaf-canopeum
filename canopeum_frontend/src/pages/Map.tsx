import ReactMap from 'react-map-gl/maplibre';

const Map = () => (
  <div className='container-fluid p-0'>
    <div className="row m-0">
      <div className="col-4 mt-3" style={{ height: 'calc(100vh - 4.4rem)', overflowY: 'scroll' }} />
      <div className="col-8 d-flex p-0" style={{ height: 'calc(100vh - 3.4rem)' }}>
        <ReactMap
          initialViewState={{
            longitude: -70,
            latitude: 50,
            zoom: 10
          }}
          mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=fSPw19J7BbjcbrS5b5u6"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>

  </div>
)
export default Map
