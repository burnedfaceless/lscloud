![Logo](https://github.com/Consolidated-Utilities/LiftStation.cloud-App-Icons/raw/master/Icons/Combined/Combined.png)
# lscloud 
**Description:** A CLI that interacts with the LiftStation.cloud Public API.

## Installation
```bash
npm i -g lscloud
```

## Basic Usage
Run `lscloud` to get a list of commands
```bash
consolidated@pc:~$ lscloud
lscloud

Commands:
  lscloud config             Enter your API Credentials
  lscloud get wells          Retrieve the name and id of your organization\'s
                             wells.
  lscloud push well reading  Push a well reading to the cloud.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]

```

Run any command with `--help` to get more information on that command
```bash
consolidated@pc:~$ lscloud config --help
lscloud config

Enter your API Credentials

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --api_key     Your API Key                                 [string] [required]
  --api_secret  Your API Secret                              [string] [required]
```

Visit [https://docs.liftstation.cloud](https://docs.liftstation.cloud) for more detailed documentation


