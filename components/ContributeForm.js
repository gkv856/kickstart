import React from "react";
import { Card, Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign.js";
import web3 from "../ethereum/web3.js";
import { Router } from "../routes.js";

class ContributeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      loading: false,
      errorMessage: "",
    };

    this.onValChange = this.onValChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onValChange(event) {
    this.setState({ value: event.target.value });
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
    });

    try {
      const campaign = await Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      console.log(this.props.address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({
        errorMessage: err.message,
        // minContribution: "",
      });
      console.log(err.message);
      // alert(this.state.errorMessage);
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={this.onValChange}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button
          primary={true}
          loading={this.state.loading}
          disabled={this.state.loading}
        >
          Contribute
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
