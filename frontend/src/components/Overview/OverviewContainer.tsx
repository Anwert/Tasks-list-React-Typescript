import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import * as action from "../../actions";
import { IAction, IStoreAll, ITask } from "../../interfaces";
import { OverviewComponent } from "./OverviewComponent";
import { IConnectedDispatch, IConnectedStore, IOwnState } from "./OverviewInterfaces";

const mapStateToProps = (store: IStoreAll): IConnectedStore => ({
  tasks: store.tasks.filter((task) => task.date.getUTCMonth() === store.filterTasksByMonth),
  enabledMonth: store.filterTasksByMonth,
});

const mapDispatchToProps = (dispatch: redux.Dispatch<IAction>): IConnectedDispatch => ({
  filterTasksByMonth: (month: number) => {
    dispatch(action.filterTasksByMonth(month));
  },
});

class OverviewContainer extends React.PureComponent<IConnectedStore & IConnectedDispatch, IOwnState> {

  constructor(props: IConnectedStore & IConnectedDispatch) {
    super(props);
    this.state = {
      modalIsOpened: false,
    };
    this.chooseMonth = this.chooseMonth.bind(this);
    this.getDate = this.getDate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.enabled = this.enabled.bind(this);
  }

  public render() {
    return (
      <OverviewComponent
        tasks={this.props.tasks}
        enabledMonth={this.props.enabledMonth}
        modalIsOpened={this.state.modalIsOpened}
        chooseMonth={this.chooseMonth}
        enabled={this.enabled}
        getDate={this.getDate}
        openModal={this.openModal}
        closeModal={this.closeModal}
      />
    );
  }

  private getDate = function() {
    const date = new Date();
    date.setUTCMonth(this.props.enabledMonth);
    if (new Date().getUTCMonth() !== this.props.enabledMonth) {
      date.setUTCDate(1);
    }
    return date;
  };

  private chooseMonth = function(month: number) {
    this.props.filterTasksByMonth(month);
  };

  private openModal = function() {
    this.setState({
      modalIsOpened: true,
    });
  };

  private closeModal = function() {
    this.setState({
      modalIsOpened: false,
    });
  };

  private enabled = function(month: number) {
    if (month === this.props.enabledMonth) {
      return `month__btn--active`;
    }
    return ``;
  };
}

export const Overview: React.ComponentClass =
  connect(mapStateToProps, mapDispatchToProps)(OverviewContainer);