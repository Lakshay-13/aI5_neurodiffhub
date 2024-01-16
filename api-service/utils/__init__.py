import os
import re

def extract_environment_variable(name: str) -> str:
    try:
        return os.getenv(name)
    except KeyError:
        raise RuntimeError(f"The {name} environment variable is missing.")


def normalize_name(name: str) -> str:
    name = name.lower().replace(' ', '_')
    final_name = name[:]
    for letter in name:
        if(letter.isalnum() or letter=='-' or letter in ['\'','\"']):
            pass
        else:
            final_name = final_name.replace(letter, '_')
    #print(final_name)
    return final_name
