import React from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout.js";
import { Link } from "../../../routes.js";
import Campaign from "../../../ethereum/campaign.js";
import web3 from "../../../ethereum/web3.js";
import RequestRow from "../../../components/RequestRow.js";

class RequestIndex extends React.Component {
  static async getInitialProps(ctx) {
    const address = ctx.query.address;
    const campaign = await Campaign(address);
    const numRequests = parseInt(await campaign.methods.numRequests().call());
    const numContributers = parseInt(
      await campaign.methods.numContributers().call()
    );

    const requests = await Promise.all(
      Array(numRequests)
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );
    // console.log(requests);
    return { address, campaign, requests, numRequests, numContributers };
  }

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      loading: false,
      errorMessage: "",
    };
  }

  renderRows() {
    // for each request return a RequestRow component
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          numContributers={this.props.numContributers}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h1>Pending requests</h1>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <Button
            primary={true}
            content="New Request"
            icon="add circle"
            primary={true}
            labelPosition="left"
          ></Button>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>Id</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approver</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
      </Layout>
    );
  }
}

export default RequestIndex;
