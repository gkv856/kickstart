import React from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3.js";
import Campaign from "../ethereum/campaign.js";
import { Router } from "../routes.js";

class RequestRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorMessage: "",
    };

    this.onApprove = this.onApprove.bind(this);
  }

  async onApprove(event) {
    event.preventDefault();

    this.setState({
      loading: true,
      errorMessage: "",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await Campaign(this.props.address);

      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({
        errorMessage: err.message,
        // minContribution: "",
      });
    }

    this.setState({ loading: false });
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request } = this.props;

    return (
      <Row>
        <Cell>{parseInt(id) + 1}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell style={{ overflowWrap: "break-word" }}>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{this.props.numContributers}
        </Cell>
        <Cell>
          <Button
            content="Approve"
            icon="check"
            primary={true}
            basic={true}
            labelPosition="left"
            floated="right"
            onClick={this.onApprove.bind(this)}
            loading={this.state.loading}
            disabled={this.state.loading}
          />
        </Cell>
        <Cell>
          <Button
            content="Finalize"
            icon="save"
            labelPosition="left"
            floated="right"
            color="green"
          />
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
