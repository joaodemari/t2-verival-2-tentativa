import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export interface TableColumn {
  header: string;
  accessor: string;
}

export interface TableRow {
  [key: string]: unknown; // Assume que cada row é um objeto com chaves dinâmicas
}

export interface TableProps {
  head: TableColumn[];
  body: TableRow[];
}

const TableComponent = (props: TableProps) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          {props.head.map((column, index) => (
            <Th key={index}>{column.header}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {props.body.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {props.head.map((header, headerIndex) => (
              <Td key={headerIndex}>{String(row[header.accessor])}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TableComponent;
