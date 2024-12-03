import { IGeoObjectLayers, IGeoObjectStatus, IGeoWrapper } from "../types/types"

export interface IObjectsState {
  isLoading: boolean
  savedObjects: IGeoWrapper
  geoObjects: IGeoWrapper
  geoObjectType: Record<string, string>
  filterGeoObjects: IGeoWrapper
  statusObject: Array<IGeoObjectStatus>
  layersObject: Array<IGeoObjectLayers>
  error: string
}
