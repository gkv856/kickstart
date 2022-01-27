import React from "react";
import { Grid, Card, Button } from "semantic-ui-react";
import Layout from "../../components/Layout.js";
import ContributeForm from "../../components/ContributeForm.js";
import factory from "../../ethereum/factory.js";
import web3 from "../../ethereum/web3.js";
import { Link, Router } from "../../routes.js";
import campaignContract from "../../ethereum/campaign.js";

class CampaignShow extends React.Component {
  static async getInitialProps(ctx) {
    const contractAddress = ctx.query.address;
    // console.log(contractAddress);
    const campaign = await campaignContract(contractAddress);
    const summary = await campaign.methods.getSummary().call();
    // console.log(summary);
    return {
      address: ctx.query.address,
      minContribution: summary[0],
      balance: summary[1],
      numRequests: summary[2],
      numContributers: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minContribution,
      numRequests,
      numContributers,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "Manager created this campaign and can request to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: numRequests,
        meta: "Number of Requests",
        description:
          "Number of request to withdraw money from the contract. Request must be approved by approvers",
      },
      {
        header: numContributers,
        meta: "Number of approvers",
        description: "Number of people who have donated to this campaign.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (Ether)",
        description: "Amount of money this campaign can spend",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h1>Campaign Details!</h1>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <Button primary={true}>View Requests</Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
