
import os
import time

from utils import extract_environment_variable

MODELSTORE_BUCKET = extract_environment_variable("MODELSTORE_BUCKET")


def is_remote_store():
    if MODELSTORE_BUCKET.startswith("gs:"):
        return True
    else:
        return False


def get_solution(solution_id, version):
    # Check if remote store
    if is_remote_store():
        ...
    else:
        solution_file_path = os.path.join(
            MODELSTORE_BUCKET, solution_id, version)
        print("solution_file_path", solution_file_path)

        # Read the file
        with open(solution_file_path, 'rb') as read_file:
            solution_file = read_file.read()

        return solution_file


def save_solution(file, solution_id, version):
    # Check if remote store
    if is_remote_store():
        ...
    else:
        # solution_file_path = os.path.join(MODELSTORE_BUCKET,name+'_'+str(int(time.time())))
        # print("solution_file_path",solution_file_path)

        # # Save the file
        # with open(solution_file_path,'wb') as write_file:
        #     write_file.write(file)

        solution_path = os.path.join(MODELSTORE_BUCKET, solution_id)
        if not os.path.exists(solution_path):
            os.makedirs(solution_path)
        solution_file_path = os.path.join(
            MODELSTORE_BUCKET, solution_id, version)
        # Save the file
        with open(solution_file_path, 'wb') as write_file:
            write_file.write(file)

        return solution_file_path
