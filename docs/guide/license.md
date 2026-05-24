# License activation

The application requires the license file to start. You can provide the license file in two ways.

## Default location

Mount the license file inside the container at:

```
/etc/vascular-inbox/.license
```

## Custom location

Mount the license file anywhere you prefer and provide the path using:

```
--license-file=/custom/path/.license
```

If the license file is missing or invalid, the application will not start.
