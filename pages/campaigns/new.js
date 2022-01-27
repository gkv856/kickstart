import React from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout.js";
import factory from "../../ethereum/factory.js";
import web3 from "../../ethereum/web3.js";
import { Router } from "../../routes.js";

class CampaignNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minContribution: "",
      errorMessage: "",
      loading: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onMinContributionChange = this.onMinContributionChange.bind(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
    });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(this.state.minContribution).send({
        from: accounts[0],
      });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({
        errorMessage: err.message,
        // minContribution: "",
      });
      // alert(this.state.errorMessage);
    }
    this.setState({ loading: false });
  }

  onMinContributionChange(event) {
    this.setState({
      minContribution: event.target.value,
      errorMessage: "",
    });
  }

  render() {
    return (
      <Layout>
        <h1>Create New Campaign!</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minContribution}
              onChange={this.onMinContributionChange}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button
            primary={true}
            loading={this.state.loading}
            disabled={this.state.loading}
          >
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
