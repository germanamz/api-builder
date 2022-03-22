const filterExternals =
  (
    externals: string[],
    packageJson: any,
    targetPackageJson: { dependencies: any }
  ) =>
  (externalContext: any, cb: any) => {
    const externalIndex = externals.findIndex(
      (external) => externalContext.request.indexOf(external) === 0
    );

    if (externalIndex !== -1) {
      const external = externals[externalIndex];
      if (packageJson.dependencies[external]) {
        // eslint-disable-next-line no-param-reassign
        targetPackageJson.dependencies[external] =
          packageJson.dependencies[external];
      }
      cb(null, `commonjs ${externalContext.request}`);
      return;
    }

    cb();
  };

export default filterExternals;
