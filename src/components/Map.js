import React, { Component } from 'react'
import { withGoogleMap, GoogleMap } from 'react-google-maps'
import { PlaceMarker } from './PlaceMarker'


const AirbnbMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    onZoomChanged={props.handleMapChanged}
    onDragEnd={props.handleMapChanged}
    onBoundsChanged={props.handleMapFullyLoaded}
    defaultCenter={props.center}
    defaultZoom={props.zoom}>
    {
      props.places.length > 0 && props.places.map(place => (
        <PlaceMarker key={`place${place.id}`}
                     id={place.id}
                     lat={place.latitude}
                     lng={place.longitude}
                     description={place.description}
                     name={place.name}
                     price={place.price} />
      ))
    }
  </GoogleMap>
));

export class Map extends Component {
  constructor(props) {
    super(props)
    this.xMapBounds = { min: null, max: null }
    this.yMapBounds = { min: null, max: null }

    this.mapFullyLoaded = false
    this.zoom = 7

    this.state = {
      places: [],
      lat: 50.0515918,
      lng: 19.9357531
    };
  }

  handleMapChanged() {
    this.getMapBounds()
    this.setMapCenterPoint()
    this.fetchPlacesFromApi()
  }

  handleMapMounted(map) {
    this.map = map
  }

  handleMapFullyLoaded() {
    if (this.mapFullyLoaded)
      return

    this.mapFullyLoaded = true
    this.handleMapChanged()
  }

  setMapCenterPoint() {
    this.setState({
      lat: this.map.getCenter().lat(),
      lng: this.map.getCenter().lng()
    })
  }

  fetchPlacesFromApi() {
    this.setState({ places: [] })

    fetch(`/api/places?min_lng=${this.xMapBounds.min}&max_lng=${this.xMapBounds.max}&min_lat=${this.yMapBounds.min}&max_lat=${this.yMapBounds.max}`,
      { method: 'GET' })
      .then((response) => response.json())
      .then((response) => this.setState({ places: response }))
  }


  getMapBounds() {
    const mapBounds = this.map.getBounds()
    const boundsNE = mapBounds.getNorthEast()
    const boundsSW = mapBounds.getSouthWest()

    this.xMapBounds.min = boundsSW.lng()
    this.xMapBounds.max = boundsNE.lng()

    this.yMapBounds.min = boundsSW.lat()
    this.yMapBounds.max = boundsNE.lat()
  }

  render() {
    const {lat, lng, places} = this.state

    return(
      <div style={{width: `750px`, height: `750px`}}>
        <AirbnbMap
          onMapMounted={this.handleMapMounted.bind(this)}
          handleMapChanged={this.handleMapChanged.bind(this)}
          handleMapFullyLoaded={this.handleMapFullyLoaded.bind(this)}
          center={{
            lat: lat,
            lng: lng
          }}
          places={places}
          zoom={this.zoom}
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
        />
      </div>
    );
  }
}