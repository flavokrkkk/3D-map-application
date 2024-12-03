import { objectSelector } from "@entities/objects/model/store/selectors"
import { useActions } from "@shared/hooks/useActions"
import { useAppSelector } from "@shared/hooks/useAppSelector"
import MapWidget from "@widgets/mapWidget/ui/mapWidget"
import { useEffect, useState } from "react"

const ObjectPage = () => {
  const { filterGeoObjects, layersObject } = useAppSelector(objectSelector)
  const { getAllObjects, getStatusObject, getLayers } = useActions()
  const [selectedLayer, setSelectedLayer] = useState<string>("Выбрать слой")
  const [selectedMapType, setSelectedMapType] = useState<boolean>(false)

  const handleChange = (value: string) => setSelectedLayer(value)
  const handleChangeMapType = (value: boolean) => setSelectedMapType(value)

  useEffect(() => {
    getAllObjects(
      ["Выбрать слой", "Выбрать все"].includes(selectedLayer)
        ? { query: "", is_negative: selectedMapType }
        : { query: selectedLayer, is_negative: selectedMapType }
    )
  }, [selectedLayer, selectedMapType])

  useEffect(() => {
    getStatusObject()
    getLayers()
  }, [])

  return (
    <div className="h-full">
      <MapWidget
        geoObjects={filterGeoObjects}
        selectedLayer={selectedLayer}
        layersObject={layersObject}
        handleChange={handleChange}
        handleChangeMapType={handleChangeMapType}
      />
    </div>
  )
}

export default ObjectPage
