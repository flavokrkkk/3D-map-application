import { Table } from "antd"

const MainPage = () => {
  const dataSource = [
    {
      underground_count: 690,
      aboveground_count: 18354,
      avg_depth_aboveground: 17.406015037593985,
      avg_depth_underground: -12.8
    },
    {
      underground_count: 690,
      aboveground_count: 18354,
      avg_depth_aboveground: 17.406015037593985,
      avg_depth_underground: -12.8
    },
    {
      underground_count: 690,
      aboveground_count: 18354,
      avg_depth_aboveground: 17.406015037593985,
      avg_depth_underground: -12.8
    }
  ]

  const dataSourceNepial = [
    {
      name: "Медь",
      count: 40
    },
    {
      name: "Сталь",
      count: 34
    },
    {
      name: "Чугун",
      count: 33
    },
    {
      name: "Пластик",
      count: 25
    },
    {
      name: "Полиэтилен",
      count: 4
    },
    {
      name: "Алюминий",
      count: 2
    }
  ]

  const columns = [
    {
      title: "Подземные комуникации",
      dataIndex: "underground_count",
      key: "underground_count"
    },
    {
      title: "Надземные комуникации",
      dataIndex: "aboveground_count",
      key: "aboveground_count"
    },
    {
      title: "Средняя глубина подземных комуникаций",
      dataIndex: "avg_depth_underground",
      key: "avg_depth_underground"
    },
    {
      title: "Средняя глубина надземных комуникаций",
      dataIndex: "avg_depth_aboveground",
      key: "avg_depth_aboveground"
    }
  ]

  const columnss = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Счетчик",
      dataIndex: "count",
      key: "count"
    }
  ]
  return (
    <div className="mx-auto w-[1000px] mt-5 space-y-10">
      <Table dataSource={dataSource} columns={columns} size="large" className="border rounded-xl" />
      <Table
        dataSource={dataSourceNepial}
        columns={columnss}
        size="large"
        className="border rounded-xl"
      />
    </div>
  )
}

export default MainPage
