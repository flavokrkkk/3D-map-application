import { IGeoObject } from "@entities/objects"
import * as Cesium from "cesium"
import { RefObject, useCallback, useEffect, useState } from "react"
import { EActiveWatches } from "../utils"

export const useGeoObject = (viewerRef: RefObject<Cesium.Viewer>) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedObject, setSelectedObject] = useState<IGeoObject | null>(null)
  const [watches, setWatches] = useState<EActiveWatches>(EActiveWatches.WATHES_ICON)

  const processGeoJsonEntities = useCallback(
    (dataSource: Cesium.DataSource, viewer: Cesium.Viewer): void => {
      try {
        const entities = dataSource.entities.values

        entities.forEach(entity => {
          const type: IGeoObject["type"] = entity.properties?.type?.getValue() || "unknown"
          const status: string = entity.properties?.status?.getValue() || "unknown"

          const positions = entity.polyline?.positions?.getValue(Cesium.JulianDate.now())

          if (positions) {
            entity.polyline = undefined

            entity.polylineVolume = new Cesium.PolylineVolumeGraphics({
              positions: positions,
              shape: [...Array(64).keys()].map(i => {
                const angle = (i / 64) * 2 * Math.PI
                return new Cesium.Cartesian2(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5)
              }),
              material: new Cesium.ColorMaterialProperty(Cesium.Color.AQUA),
              cornerType: Cesium.CornerType.ROUNDED
            })

            const midpoint = positions?.[0] || entity.position?.getValue(Cesium.JulianDate.now())

            if (midpoint) {
              if (watches === EActiveWatches.WATHES_ICON) {
                entity.billboard = new Cesium.BillboardGraphics({
                  image: "/locateIcon.svg",
                  scale: 0.6,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                })
              } else {
                entity.billboard = undefined
              }

              entity.label = new Cesium.LabelGraphics({
                text: `Тип: ${type}\nСтатус: ${status}`,
                font: "14pt sans-serif",
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                pixelOffset: new Cesium.Cartesian2(0, -50),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.8,
                show: false
              })

              entity.position = midpoint
            }

            const updateLabelVisibility = () => {
              const cameraPosition = viewer.camera.positionWC
              const entityPosition = entity.position?.getValue(Cesium.JulianDate.now())

              if (!entityPosition) return

              const distance = Cesium.Cartesian3.distance(cameraPosition, entityPosition)

              const labelVisibilityDistance = 500

              if (entity.label) {
                entity.label.show = new Cesium.ConstantProperty(distance < labelVisibilityDistance)
              }
            }

            viewer.scene.camera.changed.addEventListener(updateLabelVisibility)
          }
        })

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

        handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
          const pickedObject = viewer.scene.pick(movement.endPosition)
          if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            document.body.style.cursor = "pointer"
          } else {
            document.body.style.cursor = "default"
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        viewer.screenSpaceEventHandler.setInputAction((movement: any) => {
          const pickedObject = viewer.scene.pick(movement.position)
          if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const pickedEntity = pickedObject.id
            const geoObjectInfo: IGeoObject = {
              id: pickedEntity.id,
              properties: {
                name: pickedEntity.properties?.name?.getValue() || "Unknown",
                type: pickedEntity.properties?.type?.getValue() || "Unknown",
                status: pickedEntity.properties?.status?.getValue() || "Unknown",
                depth: pickedEntity.properties?.depth?.getValue() || 0,
                description: pickedEntity.properties?.description?.getValue() || "",
                material: pickedEntity.properties?.material?.getValue() || ""
              },
              global_layers: pickedEntity.properties?.global_layers?.getValue() || [],
              image: pickedEntity.properties.image.getValue() || "/defaultImage.jpg",
              geometry: pickedEntity.geometry,
              type: pickedEntity.properties?.type?.getValue() || "Unknown",
              is_saved: false
            }

            setSelectedObject(geoObjectInfo)
            setIsModalVisible(true)

            viewer.zoomTo(pickedEntity)
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      } catch (error) {
        console.error("Ошибка обработки GeoJSON объектов:", error)
      }
    },
    [watches]
  )

  useEffect(() => {
    if (viewerRef.current) {
      const dataSources = viewerRef.current.dataSources

      if (dataSources) {
        const length = dataSources.length
        for (let i = 0; i < length; i++) {
          const dataSource = dataSources.get(i)
          if (dataSource) {
            processGeoJsonEntities(dataSource, viewerRef.current!)
          }
        }
      }
    }
  }, [watches, processGeoJsonEntities])

  const handleOk = () => setIsModalVisible(false)
  const handleCancel = () => setIsModalVisible(false)

  const handleLoad = (dataSource: Cesium.DataSource) => {
    if (viewerRef.current) {
      processGeoJsonEntities(dataSource, viewerRef.current)
    }
  }

  const handleChangeWatches = (value: EActiveWatches) => setWatches(value)

  return {
    handleLoad,
    isModalVisible,
    selectedObject,
    handleOk,
    handleCancel,
    handleChangeWatches
  }
}
