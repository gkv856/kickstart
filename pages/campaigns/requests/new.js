import React from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout.js";
import { Link } from "../../../routes.js";
import web3 from "../../../ethereum/web3.js";
import Campaign from "../../../ethereum/campaign.js";

class NewRequest extends React.Component {
  static async getInitialProps(ctx) {
    const contractAddress = ctx.query.address;

    // console.log(contractAddress);
    // console.log(campaign);

    return { address: contractAddress };
  }

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      description: "",
      recipient: "",
      loading: false,
      errorMessage: "",
    };

    this.onChangeDesc = this.onChangeDesc.bind(this);
    this.onChangeAmt = this.onChangeAmt.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeDesc(event) {
    this.setState({ description: event.target.value });
  }

  onChangeAmt(event) {
    this.setState({ value: event.target.value });
  }

  onChangeAddress(event) {
    this.setState({ recipient: event.target.value });
  }

  async onSubmit(event) {
    event.preventDefault(event);
    this.setState({
      loading: true,
      errorMessage: "",
    });

    const campaign = await Campaign(this.props.address);

    const { description, value, recipient } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });
    } catch (err) {
      this.setState({
        errorMessage: err.message,
        // minContribution: "",
      });
      console.log(err.message);
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>back</a>
        </Link>
        <h1>Create New Request</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={this.onChangeDesc}
            />
          </Form.Field>

          <Form.Field>
            <label>Amount in Ether</label>
            <Input value={this.state.value} onChange={this.onChangeAmt} />
          </Form.Field>
          <Form.Field>
            <label>Recipient address</label>
            <Input value={this.state.address} onChange={this.onChangeAddress} />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button
            primary={true}
            content="Create Request"
            icon="add circle"
            primary={true}
            labelPosition="left"
            loading={this.state.loading}
            disabled={this.state.loading}
          ></Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;
