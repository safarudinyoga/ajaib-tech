/* eslint-disable react-hooks/exhaustive-deps */
import { Layout, Input, Button, Table, message, Select, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import './app.sass';
import BreadCrumb from './breadcrumb';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePrevious } from './usePrevious';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

interface DataType {
  key: React.Key;
  username: usernameType;
  login: usernameType;
  name: nameType;
  email: string;
  gender: string;
  registered: registeredType;
}

interface nameType {
  title: string
  first: string
  last: string
}

interface usernameType {
  username: string
}

interface registeredType {
  date: any,
  age: string
}

interface ParamsType {
  page: number
  total?: any
  last_page?: any
  pageSize: number
  results: number
  gender?: string
  keyword?: string
}

interface ActionProps {
  params: ParamsType
  handleFilterSearch: Function | any
  handleChangeSearch: Function | any
  handleFilterGender: Function | any
  handleResetFilters: Function | any
}

interface TitleProps {
  children: React.ReactNode
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Username',
    dataIndex: 'username',
    render: (_, { username }) => username.username
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: {
      compare: (a: any, b: any) => a.name.first.toLowerCase().localeCompare(b.name.first.toLowerCase())
    },
    render: (_, { name }) => `${name.first} ${name.last}`
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: {
      compare: (a: any, b: any) => a.email.toLowerCase().localeCompare(b.email.toLowerCase())
    },
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    sorter: {
      compare: (a: any, b: any) => a.gender.localeCompare(b.gender)
    },
  },
  {
    title: 'Registered Date',
    dataIndex: 'registered',
    sorter: {
      compare: (a: any, b: any) => dayjs(a.registered.date).unix() - dayjs(b.registered.date).unix()
    },
    render: (_, { registered }) => dayjs(registered.date).format('DD-MM-YYYY HH:mm')
  },
];

const Title = ({ children }: TitleProps) => <h2>{children}</h2>

const ActionControl = ({ params, handleFilterSearch, handleChangeSearch, handleFilterGender, handleResetFilters }: ActionProps) => {
  return (
    <div className='action'>
      <div><label htmlFor="">Search</label><Search data-testid='filter-keyword' value={params.keyword} placeholder="Search..." onSearch={handleFilterSearch} onChange={handleChangeSearch} enterButton /></div>
      <div style={{ display: 'flex', flexDirection: 'column' }}><label htmlFor="">Gender</label>
      <Select data-testid='filter-gender' defaultValue={params.gender} value={params.gender} onChange={handleFilterGender} style={{ width: 200 }}>
        <Option data-testid='select-gender-option' value="all">All</Option>
        <Option data-testid='select-gender-option' value="male">Male</Option>
        <Option data-testid='select-gender-option' value="female">Female</Option>
      </Select></div>
      <div><label htmlFor=""></label><Button data-testid='button-reset-filter' onClick={handleResetFilters}>Reset Filter</Button></div>
    </div>
  )
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const prev = usePrevious(location)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<DataType[]>([])
  const [params, setParams] = useState<ParamsType>({
    page: 1,
    total: null,
    last_page: null,
    pageSize: 5,
    results: 10,
    gender: 'all',
    keyword: '',
  })

  const nav = [
    {
      to: '/',
      name: 'Home'
    },
    {
      to: '/',
      name: 'Example Page'
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const { pageSize, results, gender, keyword, page } = params

    const activeParams: ParamsType = {
      page,
      pageSize,
      results,
    }

    if (gender && gender !== 'all') {
      activeParams.gender = gender
    }

    if (keyword) {
      activeParams.keyword = keyword
    }

    try {
      const { status, data: { results: resultsList } } = await axios.get(`https://randomuser.me/api`, {
        params: { ...activeParams }
      })
      if ([200,201,202].includes(status)) {
        setIsLoading(false)
        const remap = resultsList.map(({ gender, name, email, login, registered }: DataType) => ({ gender, name, email, username: login, registered }))
        setData(remap)
        setParams({
          ...params,
          total: (results / pageSize) * results,
          last_page: Math.ceil(((results / pageSize) * results) / pageSize)
        })
      }
    } catch (error: any) {
      message.error(error)
      setIsLoading(false)
    }
  }

  const handleFilterGender = (value: string) => {
    if (value === 'all') {
      setParams({ ...params, gender: 'all' })
      pushQueryString({ ...params, gender: 'all' })
      return
    }

    const newParams = { ...params, gender: value }
    setParams(newParams)
    pushQueryString(newParams)
  }

  const handleFilterSearch = (value: string) => {
    pushQueryString({ ...params, keyword: value })
  }

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(
      { ...params, keyword: e.target.value }
    )
  }

  const handleResetFilters = () => {
    setParams({
      page: 1,
      total: null,
      last_page: null,
      pageSize: 5,
      results: 10,
      gender: 'all',
      keyword: '',
    })
    pushQueryString({
      page: 1,
      pageSize: 10,
      results: 10,
      gender: 'all',
      keyword: ''
    })
  }

  const pushQueryString = (params: any) => {
    let remapParams: {[index: string]:any} = {}
    Object.entries(params).filter(item => item[1]).forEach(item => remapParams[item[0]] = item[1])

    const formatted = `?${new URLSearchParams(remapParams)}`
    const newUrl = location.pathname + formatted
    navigate(newUrl, { replace: true })
  }

  useEffect(() => {
    if (prev !== undefined && prev !== location) {
      fetchData()
    }
  }, [location])

  const go = (to: any) => {
    const remapParams = { ...params }

    if (to === 'next') {
      if (params.page !== params.last_page) {
        remapParams.page += 1
      }
    } else if (to === 'prev') {
      if (params.page !== 0) {
        remapParams.page += 1
      }
    } else {
      remapParams.page = to
    }

    setParams({
      ...params,
      page: remapParams.page,
    })
    pushQueryString({
      ...params,
      page: remapParams.page,
    })
  }

  return (
    <Layout>
      <Content>
        <BreadCrumb nav={nav} />
        <Title>Example With Search and Filter</Title>
        <ActionControl
          params={params}
          handleFilterSearch={handleFilterSearch}
          handleChangeSearch={handleChangeSearch}
          handleFilterGender={handleFilterGender}
          handleResetFilters={handleResetFilters}
        />
        <Table data-testid='table-data' columns={columns} loading={isLoading} dataSource={data} key='email' rowKey='email' pagination={false} />
        <Pagination data-testid='table-pagination' current={params.page} total={params.total} onChange={go} disabled={isLoading} />
      </Content>
    </Layout>
  );
}

export default App;
