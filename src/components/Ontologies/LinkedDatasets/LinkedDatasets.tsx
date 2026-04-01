import Table from 'react-bootstrap/Table';

const LinkedDatasets = () => {

    return (
        <div>
            <h1>LinkedDatasets</h1>
            <Table striped bordered>
                <thead>
                <tr>
                    <th>Dataset</th>
                    <th>Linked terms</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                </tr>
                <tr>
                    <td>Jacob</td>
                    <td>Thornton</td>
                </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default LinkedDatasets;
