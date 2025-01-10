
# MySQL Helping Queries & Scripts


## Dump & Restore Tables

### Dump user & authentication related tables

``` bash
mysqldump -h {HOST_IP} -u {DB_USER} -p nucleus_db user user_permission user_region user_role user_segment role role_permission permission department sub_department department_role designation>stage_nucleus_users_auth_tables.sql
```

### Restore user & authentication tables

``` bash
mysql -h {HOST_IP} -u {DB_USER} -p nucleus_db<stage_nucleus_users_auth_tables.sql
```

### Dump alarm-fitler-config-related data tables 

``` bash
mysqldump -h {HOST} -u {USER} -p nucleus_db alarm_filter_config alarm_filter_advance_condition >stage_alarm_filter_config_data.sql


### Other helping queries will be written here