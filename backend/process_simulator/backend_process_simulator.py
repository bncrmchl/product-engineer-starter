import time
from tinydb import Query
from process_simulator.simulator_canned_data import first_update, second_update


# This function simulates some backend process that processes Cases and updates them over 30 seconds.
def simulate_backend_process(case_id, db):
    # Wait 10 seconds then perform the first update
    time.sleep(10)
    update_case_in_db(case_id, db, first_update)
    print("case status updater is done with first update")
    # Wait another 20 seconds then update to complete
    time.sleep(20)
    update_case_in_db(case_id, db, second_update)
    print("case status updater is done with second update")


# This function updates all the fields given in 'updates' for the given case id in the tinydb database of case info
def update_case_in_db(case_id, db, updates):
    QueryCase = Query()
    if db.search(QueryCase.case_id == str(case_id)):
        db.update(updates, QueryCase.case_id == str(case_id))
