import { Table } from "@mantine/core";

interface StatsTableProps {
  data: any;
};

const StatsTable = (props: StatsTableProps) => {
  return (
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {props.data.map((player) => (
              <Table.Th key={player}>{player}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
      </Table>
  )  
}

export default StatsTable;