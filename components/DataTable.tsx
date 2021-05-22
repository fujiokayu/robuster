import { useTable, useSortBy } from 'react-table'
import { useMemo } from 'react'
import Download from '../components/Download'
import Delete from '../components/Delete'

//https://flatlogic.com/blog/react-table-guide-and-best-react-table-examples/#fourteen
const DataTable = (props) => {

  const columns = useMemo(
    () => [
      {
        Header: () => (
          <div style={{ textAlign: 'left' }}>ファイル名</div>
        ),
        accessor: 'name',
        isSorted: 'true',
        Cell: row => (
          <div style={{ textAlign: 'left' }}>{row.value}</div>
        )
      },
      {
        Header: () => (
          <div style={{ textAlign: 'left' }}>ファイル種別</div>
        ),
        accessor: 'contentType',
        Cell: row => (
          <div style={{ textAlign: 'left' }}>{row.value}</div>
        )
      },
      {
        Header: () => (
          <div style={{ textAlign: 'right' }}>ファイルサイズ</div>
        ),
        accessor: 'size',
        Cell: row => (
          <div style={{ textAlign: 'right' }}>{row.value}</div>
        )
      },
      {
        Header: () => (
          <div style={{ textAlign: 'center' }}>更新日</div>
        ),
        accessor: 'updated',
        Cell: row => (
          <div style={{ textAlign: 'center' }}>{row.value}</div>
        )
      },
      {
        Header: () => (
          <div style={{ textAlign: 'center' }}>有効期限</div>
        ),
        accessor: 'expireDate',
        Cell: row => (
          <div style={{ textAlign: 'center' }}>{row.value}</div>
        )
      },
      {
        Header: () => (
          <div style={{ textAlign: 'left' }}>アップロードユーザー</div>
        ),
        accessor: 'user',
        Cell: row => (
          <div style={{ textAlign: 'left' }}>{row.value}</div>
        )
      },
      {
        Header: '',
        accessor: 'filePath',
        Cell:  v => (
          <div className='buttons'>
            <Download file={v.value} />
            <Delete file={v.value} changeState={props.changeState}/>
          </div>
        )
      }
    ],[]
  )

  const data = props.data
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ 
    columns,
    data
  }, useSortBy)

  return (
    <div>
      <table {...getTableProps()} style={{ borderColor: 'grey' }}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? '▼'
                      : '▲'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      borderColor: 'grey',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable